import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import ProductManager from "./ProductManager";
import ProductsAdmin from "./ProductsAdmin";

import '../styles/AdminPage.css'

export default function AdminPage() {
  const [produtos, setProdutos] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);

  const carregarProdutos = async () => {
    const querySnapshot = await getDocs(collection(db, "produtos"));
    const lista = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setProdutos(lista);
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  const handleDelete = async (produto) => {
    const confirm = window.confirm(
      `Deseja excluir o produto ${produto.nome}?`
    );
    if (confirm) {
      await deleteDoc(doc(db, "produtos", produto.id));
      carregarProdutos();
    }
  };

  const handleSave = () => {
    carregarProdutos();
    setProdutoSelecionado(null);
  };

  return (
    <div className="admin-page">
      <ProductManager
        produtoSelecionado={produtoSelecionado}
        onSave={handleSave}
        onCancel={() => setProdutoSelecionado(null)}
      />

      <ProductsAdmin
        produtos={produtos}
        onEdit={(produto) => setProdutoSelecionado(produto)}
        onDelete={handleDelete}
      />
    </div>
  );
}
