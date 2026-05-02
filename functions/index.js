const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const { MercadoPagoConfig, Preference, Payment } = require("mercadopago");

admin.initializeApp();
const db = admin.firestore();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

/* ---------------- MERCADO PAGO ---------------- */

const mercadopago = new MercadoPagoConfig({
  accessToken: functions.config().mercadopago.token,
});

const preferenceClient = new Preference(mercadopago);
const paymentClient = new Payment(mercadopago);

/* ---------------- EMAIL ---------------- */

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: functions.config().gmail.user,
    pass: functions.config().gmail.pass,
  },
});

/* ---------------- CRIAR PAGAMENTO ---------------- */

app.post("/", async (req, res) => {
  try {
    const { items, email } = req.body;

    if (!items || !email) {
      return res.status(400).json({ error: "Itens ou email ausentes" });
    }

    const mpItems = items.map((item) => ({
      title: item.title,
      description: item.id, // id do produto no firestore
      quantity: Number(item.quantity),
      unit_price: Number(item.unit_price),
      currency_id: "BRL",
    }));

    const preference = {
      items: mpItems,
      payer: { email },

      back_urls: {
        success: "https://ameliercrochet.com.br/sucesso",
        failure: "https://ameliercrochet.com.br/falha",
        pending: "https://ameliercrochet.com.br/pendente",
      },

      auto_return: "approved",

      notification_url:
        "https://us-central1-amelier-crochet.cloudfunctions.net/createPreference/webhook",
    };

    const response = await preferenceClient.create({
      body: preference,
    });

    res.json({ init_point: response.init_point });
  } catch (error) {
    console.error("Erro criando pagamento:", error);
    res.status(500).json({ error: "Erro ao criar pagamento" });
  }
});

/* ---------------- WEBHOOK ---------------- */

app.post("/webhook", async (req, res) => {
  try {
    const paymentId = req.query.id || req.body.data?.id;

    if (!paymentId) return res.sendStatus(400);

    const payment = await paymentClient.get({ id: paymentId });

    if (payment.status !== "approved") {
      return res.sendStatus(200);
    }

    const email = payment.payer.email;

    const items = payment.additional_info?.items || [];

    for (const item of items) {
      const produtoId = item.description;

      const produtoRef = db.collection("produtos").doc(produtoId);
      const produtoSnap = await produtoRef.get();

      if (!produtoSnap.exists) {
        console.error("Produto não encontrado:", produtoId);
        continue;
      }

      const produto = produtoSnap.data();

      /* SALVAR COMPRA */

      await db.collection("compras").add({
        email,
        produtoId,
        produtoNome: produto.nome,
        paymentId,
        valor: item.unit_price,
        data: new Date(),
      });

      /* ENVIAR EMAIL */

      await transporter.sendMail({
        from: "Amelier Crochê <amelier.crochet@gmail.com>",
        to: email,
        subject: `Sua receita de ${produto.nome} 🧶`,
        html: `
        <h2>Obrigada pela sua compra 💜</h2>
        <p>Clique abaixo para baixar sua receita:</p>

        <a href="${produto.pdf}" 
        style="
        background:#7c3aed;
        color:white;
        padding:12px 20px;
        border-radius:6px;
        text-decoration:none;
        ">
        Baixar Receita
        </a>

        <p>Salve o arquivo no seu dispositivo 😉</p>
        `,
      });
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Erro webhook:", error);
    res.sendStatus(500);
  }
});

exports.createPreference = functions.https.onRequest(app);