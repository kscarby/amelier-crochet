import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { listarProdutos } from "../productService";

import '../styles/DetailsPage.css'

export default function DetailsPage({ addToCart }) {
  const { id } = useParams();
  const [produto, setProduto] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const carregarProduto = async () => {
      try {
        const lista = await listarProdutos();
        const encontrado = lista.find((p) => String(p.id) === id);
        setProduto(encontrado);
      } catch (error) {
        console.error("Erro ao carregar produto:", error);
      } finally {
        setCarregando(false);
      }
    };

    carregarProduto();
  }, [id]);

  if (carregando) return <p>Carregando produto...</p>;
  if (!produto) return <p>Produto não encontrado!</p>;

  return (
    <div className="card-detailspage">
      <div className="image-wrapper-details">
        <img
          className="img-newproduct"
          src={produto.image}
          alt={produto.nome}
        />
      </div>

      <div className="card-price-details">
        <h1>{produto.nome}</h1>
        <h2>R$ {produto.preco.toFixed(2)}</h2>
        <p>
          R$ {produto.preco.toFixed(2)} à vista ou 3x R$
          {(produto.preco / 3).toFixed(2)} sem juros
        </p>
        
        <div className="card-buy-details">
            <button className="button-buy-details" onClick={() => addToCart(produto)}>
            Adicionar ao carrinho
            </button>
            <button className="button-buy-details" onClick={() => addToCart(produto)}>
            Comprar
            </button>
        </div>
      </div>
        <div className="card-details-info">
            <p>{produto.info}</p>

        </div>
    </div>
  );
}
