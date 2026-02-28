const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json"); // 👉 Seu arquivo da conta de serviço

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const uid = "ds2O7WXIDyUQk7YZrlneGxnb20d2"; // 🔥 Seu UID aqui

admin.auth().setCustomUserClaims(uid, { isAdmin: true })
  .then(() => {
    console.log(`✅ Usuário ${uid} agora é ADMIN.`);
    process.exit();
  })
  .catch((error) => {
    console.error("❌ Erro ao definir admin:", error);
    process.exit(1);
  });

