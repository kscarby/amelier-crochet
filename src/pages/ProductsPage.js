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
  todos: "Todos os Produtos",
};

export default function ProductsPage({ addToCart }) {
  const { categoria } = useParams();
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const categoriaSelecionada = categoria ? categoria.toLowerCase() : "todos";

  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        const lista = await listarProdutos();

        const filtrados =
          categoriaSelecionada === "todos"
            ? lista
            : lista.filter(
                (item) =>
                  item.categoria.toLowerCase() === categoriaSelecionada
              );

        setProdutos(filtrados);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      } finally {
        setCarregando(false);
      }
    };

    carregarProdutos();
  }, [categoriaSelecionada]);

  return (
    <div className="app">
      <h1 className="new-title">
        {categoriasMapeadas[categoriaSelecionada] || "Produtos"}
      </h1>

      {carregando ? (
        <p>Carregando produtos...</p>
      ) : produtos.length > 0 ? (
        produtos.map((item) => (
          <ProductCard key={item.id} produto={item} addToCart={addToCart} />
        ))
      ) : (
        <p>Nenhum produto encontrado.</p>
      )}
    </div>
  );
}
