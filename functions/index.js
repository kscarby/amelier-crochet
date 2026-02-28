// functions/index.js
const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const { MercadoPagoConfig, Preference, Payment } = require("mercadopago");
const nodemailer = require("nodemailer");
const { getFirestore, doc, getDoc } = require("firebase-admin/firestore");
const admin = require("firebase-admin");

admin.initializeApp();
const db = getFirestore();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Configurações Mercado Pago
const mercadopago = new MercadoPagoConfig({
  accessToken: "APP_USR-3114926596313854-090418-63b2fea746a382cf64e41221687800d3-2568259463",
});
const preferenceClient = new Preference(mercadopago);
const paymentClient = new Payment(mercadopago);

// Configuração do email (Gmail App Password)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "amelier.crochet@gmail.com",
    pass: "SUA_SENHA_DE_APP",
  },
});

// Rota para criar preferência
app.post("/", async (req, res) => {
  const { items, email } = req.body;

  if (!items || !email) return res.status(400).json({ error: "Itens ou email ausentes" });

  // Mapeia itens para a estrutura do Mercado Pago
  const mpItems = items.map(item => ({
    title: item.title,
    description: item.description, // ID do Firestore
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
    notification_url: "https://us-central1-amelier-crochet.cloudfunctions.net/createPreference/webhook",
  };

  try {
    const response = await preferenceClient.create({ body: preference });
    res.json({ init_point: response.init_point });
  } catch (err) {
    console.error("Erro criar preferência:", err);
    res.status(500).json({ error: err.message || "Erro interno" });
  }
});

// Webhook Mercado Pago
app.post("/webhook", async (req, res) => {
  try {
    const paymentId = req.query.id || req.body.data?.id;
    if (!paymentId) return res.sendStatus(400);

    const response = await paymentClient.get({ id: paymentId });
    const payment = response;

    if (payment.status === "approved") {
      const email = payment.payer.email;

      // payment.items pode não existir, então usamos payment.description do item
      const items = payment.additional_info?.items || [{ description: payment.description }];

      for (const item of items) {
        const produtoId = item.description;
        const produtoRef = doc(db, "produtos", produtoId);
        const produtoSnap = await getDoc(produtoRef);

        if (!produtoSnap.exists()) {
          console.error("Produto não encontrado:", produtoId);
          continue;
        }

        const produtoData = produtoSnap.data();
        const linkPdf = produtoData.pdf; // URL pública do Storage

        // Envia email com link do PDF
        await transporter.sendMail({
          from: "Amelier Crochê <amelier.crochet@gmail.com>",
          to: email,
          subject: `Sua receita de ${produtoData.nome} 🧶`,
          html: `
            <p>Olá! 💜</p>
            <p>Obrigada pela sua compra. Clique no link abaixo para baixar sua receita:</p>
            <a href="${linkPdf}">Baixar Receita PDF</a>
            <p><b>Atenção:</b> salve o arquivo no seu dispositivo 😉</p>
          `,
        });
      }
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("Erro no webhook:", err);
    res.sendStatus(500);
  }
});

exports.createPreference = functions.https.onRequest(app);
