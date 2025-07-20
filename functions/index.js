const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const { MercadoPagoConfig, Preference } = require("mercadopago");

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Configure Mercado Pago
const mercadopago = new MercadoPagoConfig({
  accessToken: "APP_USR-4446263156188276-011314-81bd533c0a3214fd0901e225b82c3880-192498083", // <-- insira sua chave correta
});
const preferenceClient = new Preference(mercadopago);

// Rota para criar preferência
app.post("/", async (req, res) => {
  const { items } = req.body;

  if (!items || !Array.isArray(items)) {
    return res.status(400).json({ error: "Items inválidos ou ausentes." });
  }

  const preference = {
    items: items.map((prod) => ({
      title: prod.title,
      quantity: prod.quantity,
      currency_id: "BRL",
      unit_price: prod.unit_price,
    })),
    back_urls: {
      success: "https://seusite.com/sucesso",
      failure: "https://seusite.com/falha",
      pending: "https://seusite.com/pendente",
    },
    auto_return: "approved",
  };

  try {
    const response = await preferenceClient.create({ body: preference });
    return res.json({ init_point: response.init_point });
  } catch (error) {
    console.error("Erro ao criar preferência:", error);
    return res.status(500).json({ error: error.message || "Erro interno" });
  }
});

exports.createPreference = functions.https.onRequest(app);
