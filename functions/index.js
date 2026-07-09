const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

      /* SALVAR COMPRA */

      await db.collection("compras").add({
        email,
        produtoId,
        produtoNome: produto.nome,
        paymentId,
        valor: item.unit_price,
        data: new Date(),
      });

exports.createPreference = functions.https.onRequest(app);