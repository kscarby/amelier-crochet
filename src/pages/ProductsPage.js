import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { listarProdutos } from "../productService";
import ProductCard from "../components/ProductCard";

import "../styles/ProductPage.css";

const categoriasMapeadas = {
  lancamentos: "Lançamentos",
  amigurumis: "Amigurumis",
  chaveiros: "Chaveiros",
  acessorios: "Acessórios",
  receitas: 'Receitas',
  todos: "Todos os Produtos",
};

export default function ProductsPage({ addToCart }) {
  const { categoria } = useParams();
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [filtro, setFiltro] = useState("");

  const categoriaSelecionada = categoria ? categoria.toLowerCase() : "todos";

  useEffect(() => {
  const carregarProdutos = async () => {
    try {
      const lista = await listarProdutos();
      console.log("Todos os produtos:", lista);
      console.log("Categoria na URL:", categoria);
      console.log("Categoria selecionada:", categoriaSelecionada);

      const filtrados =
        categoriaSelecionada === "todos"
          ? lista
          : lista.filter(
              (item) =>
                (item.categoria || "").toLowerCase() === categoriaSelecionada
            );

      console.log("Produtos filtrados:", filtrados);
      setProdutos(filtrados);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    } finally {
      setCarregando(false);
    }
  };

  carregarProdutos();
}, [categoriaSelecionada]);


  const produtosFiltrados = produtos.filter(
    (produto) =>
      produto.nome?.toLowerCase().includes(filtro.toLowerCase()) ||
      produto.categoria?.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="app">
      <h1 className="new-title">
        {categoriasMapeadas[categoriaSelecionada] || "Produtos"}
      </h1>

      {carregando ? (
        <p>Carregando produtos...</p>
      ) : produtosFiltrados.length > 0 ? (
        produtosFiltrados.map((item) => (
          <ProductCard key={item.id} produto={item} addToCart={addToCart} />
        ))
      ) : (
        <p>Nenhum produto encontrado.</p>
      )}
    </div>
  );
}
