// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";
import { connectFunctionsEmulator } from "firebase/functions";

const firebaseConfig = {
    apiKey: "AIzaSyCjPW_jW5dp6oaH3Ymfey4GtMTUYEruRpc",
    authDomain: "amelier-crochet.firebaseapp.com",
    projectId: "amelier-crochet",
    storageBucket: "amelier-crochet", 
    messagingSenderId: "321958770821",
    appId: "1:321958770821:web:0ca2832490808eb3fc51ec"
};

// Inicializar o Firebase
const app = initializeApp(firebaseConfig);

// Exportar serviços
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const functions = getFunctions(app);

if (window.location.hostname === 'localhost') {
  connectFunctionsEmulator(functions, '127.0.0.1', 8864);
}

export { app, auth, db, storage, functions };
