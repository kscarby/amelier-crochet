import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

// 🔥 Coleção no Firestore chamada "produtos"
const colecao = collection(db, "produtos");

// ✅ Listar todos os produtos
export async function listarProdutos() {
  const snapshot = await getDocs(colecao);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

// ✅ Criar um novo produto
export async function criarProduto(produto) {
  await addDoc(colecao, produto);
}

// ✅ Atualizar um produto existente
export async function atualizarProduto(id, dadosAtualizados) {
  const produtoRef = doc(db, "produtos", id);
  await updateDoc(produtoRef, dadosAtualizados);
}

// ✅ Deletar um produto
export async function deletarProduto(id) {
  const produtoRef = doc(db, "produtos", id);
  await deleteDoc(produtoRef);
}
