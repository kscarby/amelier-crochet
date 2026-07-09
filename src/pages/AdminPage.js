import React, { useEffect, useState } from "react";
import { db } from "../firebase.js";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import ProductManager from "./ProductManager.js";
import ProductsAdmin from "./ProductsAdmin.js";
import OrdersPage from './OrdersPage.js'

import '../styles/AdminPage.css'

export default function AdminPage() {
  const [aba, setAba] = useState("");
  const [produtos, setProdutos] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);

  const carregarProdutos = async () => {
    const produtosRef = collection(db, "produtos");
    const querySnapshot = await getDocs(produtosRef);
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
    <div>
      <div className="admin-buttons">
        <button onClick={() => setAba("novo")}>
          Novo Produto
        </button>

        <button onClick={() => setAba("produtos")}>
          Meus Produtos
        </button>

        <button onClick={() => setAba("pedidos")}>
          Pedidos
        </button>
      </div>
      {aba === "novo" && (
        <ProductManager
          produtoSelecionado={produtoSelecionado}
          onSave={handleSave}
        />
      )}

      {aba === "pedidos" && (
        <OrdersPage
        />
      )}

      {aba === "produtos" && (
        <ProductsAdmin
          produtos={produtos}
          onEdit={(produto) => {
            setProdutoSelecionado(produto);
            setAba("novo"); // abre a tela de edição
          }}
          onDelete={handleDelete}
        />
      )}

    </div>
  );
}
