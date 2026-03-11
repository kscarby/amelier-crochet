import React from "react";
import "../styles/ProductCard.css";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ produto, addToCart }) {
  const navigate = useNavigate();

  const optimizedImage = produto.image?.replace(
  "/upload/",
  "/upload/f_auto,q_auto/"
);

  return (
    <div className="card-newproduct">
    <div className="image-wrapper">
        <img
          onClick={() => navigate(`/details/${produto.id}`)}
          className="img-newproduct"
          src={optimizedImage}
          alt={produto.nome}
        />
    </div>

      <div className="card-price">
        <h1>{produto.nome}</h1>
        <h2>R$ {produto.preco.toFixed(2)}</h2>
        <p>
          R$ {produto.preco.toFixed(2)} à vista com desconto ou 3x R${" "}
          {(produto.preco / 3).toFixed(2)} sem juros
        </p>

        <button
          className="button-buy"
          onClick={() => {
            const confirmar = window.confirm("Deseja adicionar este produto ao carrinho?");
            if (confirmar) {
              addToCart(produto);
            }
          }}
        >
          Comprar
        </button>
      </div>
    </div>
  );
}
