import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { listarProdutos } from "../productService";

import '../styles/ProductCard.css';

const ProductsPage = ({ addToCart }) => {
  const { categoria } = useParams();
  const [produtos, setProdutos] = useState([]);

  const categoriasMapeadas = {
    todos: "Todos",
    lançamentos: "Lançamentos",
    amigurumis: "Amigurumis",
    chaveiros: "Chaveiros",
    acessorios: "Acessórios"
  };

  useEffect(() => {
    async function carregarProdutos() {
      const lista = await listarProdutos();
      setProdutos(lista);
    }
    carregarProdutos();
  }, []);

  const produtosFiltrados = categoria.toLowerCase() === "todos"
    ? produtos
    : produtos.filter(item => item.categoria.toLowerCase() === categoria.toLowerCase());

  return (
    <div className="app">
      <h1 className="new-title">{categoriasMapeadas[categoria] || categoria}</h1>

      {produtosFiltrados.length > 0 ? (
        produtosFiltrados.map((item) => (
          <div key={item.id} className="card-newproduct">
            <img className="img-newproduct" src={item.image} alt={item.nome} />

            <div className="card-price">
              <h1>{item.nome.charAt(0).toUpperCase() + item.nome.slice(1)}</h1>
              <h2>R$ {item.preco}</h2>
              <p>
                R$ {item.preco} à vista com desconto ou 3x R$ {(item.preco / 3).toFixed(2)} sem juros
              </p>
              <div className="card-buy">
                <button className="button-buy" onClick={() => addToCart(item)}>
                  Comprar
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>Carregando produtos...</p>
      )}
    </div>
  );
};

export default ProductsPage;
