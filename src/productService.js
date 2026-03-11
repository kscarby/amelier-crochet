import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

const colecao = collection(db, "produtos");

// 📦 Listar produtos
export async function listarProdutos() {
  try {
    const snapshot = await getDocs(colecao);

    return snapshot.docs.map((documento) => ({
      id: documento.id,
      ...documento.data(),
    }));
  } catch (error) {
    console.error("Erro ao listar produtos:", error);
    return [];
  }
}

// ➕ Criar produto
export async function criarProduto(produto) {
  try {
    const produtoFormatado = {
      ...produto,
      preco: Number(produto.preco),
    };

    await addDoc(colecao, produtoFormatado);
  } catch (error) {
    console.error("Erro ao criar produto:", error);
  }
}

// ✏️ Atualizar produto
export async function atualizarProduto(id, dadosAtualizados) {
  try {
    const produtoRef = doc(db, "produtos", id);

    await updateDoc(produtoRef, {
      ...dadosAtualizados,
      preco: Number(dadosAtualizados.preco),
    });
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
  }
}

// ❌ Deletar produto
export async function deletarProduto(id) {
  try {
    const produtoRef = doc(db, "produtos", id);
    await deleteDoc(produtoRef);
  } catch (error) {
    console.error("Erro ao deletar produto:", error);
  }
}