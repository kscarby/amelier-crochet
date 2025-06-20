import React from "react";
import "../styles/ProductCard.css";

const ProductCard = ({ produto, addToCart, onEdit }) => {
  return (
    <div className="card-newproduct">
      <p className="new-p">{produto.categoria === "lancamentos" ? "Lançamento" : produto.categoria}</p>

      <img className="img-newproduct" src={produto.image} alt={produto.nome} />

      <div className="card-price">
        <h1>{produto.nome.charAt(0).toUpperCase() + produto.nome.slice(1)}</h1>
        
        <h2>R$ {produto.preco.toFixed(2)}</h2>

        <p>
          R$ {produto.preco.toFixed(2)} à vista com desconto <br />
          ou 3x de R$ {(produto.preco / 3).toFixed(2)} sem juros
        </p>

        <div className="card-buy">
          {addToCart && (
            <button className="button-buy" onClick={() => addToCart(produto)}>
              Comprar
            </button>
          )}
          {onEdit && (
            <button className="button-edit" onClick={() => onEdit(produto)}>
              Editar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
