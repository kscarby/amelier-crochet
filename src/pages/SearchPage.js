import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { listarProdutos } from "../productService";
import ProductCard from "../components/ProductCard";

export default function SearchPage({ addToCart }) {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const searchTerm = params.get("term")?.toLowerCase() || "";

  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        const lista = await listarProdutos();
        console.log("Produtos carregados:", lista);
        setProdutos(lista);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      } finally {
        setCarregando(false);
      }
    };

    carregarProdutos();
  }, []);

  const normalizar = (texto) =>
    texto?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const termo = normalizar(searchTerm);

  const produtosFiltrados = produtos.filter((produto) => {
    const nome = normalizar(produto.nome || "");
    const categoria = normalizar(produto.categoria || "");
    return nome.includes(termo) || categoria.includes(termo);
  });

  console.log("Filtrados:", produtosFiltrados);

  return (
    <div className="app">
      <h1 className="new-title">
        {searchTerm ? `Resultados para "${searchTerm}"` : "Busca"}
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
