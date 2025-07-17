const functions = require("firebase-functions");
const mercadopago = require("mercadopago");

mercadopago.access_token =
    "TEST-4446263156188276-011314-5f67b18920844cfb207c362902c0d0ad-192498083";
exports.createPreference = functions.https.onCall(async (data, context) => {
  console.log("Dados recebidos na função:", JSON.stringify(data, null, 2));

  if (!data || !Array.isArray(data.items)) {
    throw new functions.https.HttpsError(
        "invalid-argument",
        "O payload precisa conter um array 'items'.");
  }
  const {items} = data;

  const preference = {
    items: items.map((prod) => ({
      title: prod.title,
      quantity: prod.quantity,
      currency_id: "BRL",
      unit_price: prod.unit_price,
    })),
    back_urls: {
      success: "http://localhost:3000/sucesso",
      failure: "http://localhost:3000/falha",
    },
    auto_return: "approved",
  };

  try {
    const response = await mercadopago.preferences.create(preference);
    return {init_point: response.body.init_point};
  } catch (error) {
    console.error("Erro ao criar preferência:", error);
    throw new functions.https.HttpsError(
        "internal",
        error.message || "Erro desconhecido",
    );
  }
});
