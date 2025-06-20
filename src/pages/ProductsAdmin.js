import React, { useEffect, useState } from "react";

const categoriasMapeadas = {
  lancamentos: "Lançamentos",
  amigurumis: "Amigurumis",
  chaveiros: "Chaveiros",
  acessorios: "Acessórios"
};

export default function ProductsAdmin({ produtos, categoria = "todos", onEdit }) {
  const [produtosFiltrados, setProdutosFiltrados] = useState([]);

  useEffect(() => {
    if (categoria.toLowerCase() === "todos") {
      setProdutosFiltrados(produtos);
    } else {
      setProdutosFiltrados(
        produtos.filter(
          (item) => item.categoria.toLowerCase() === categoria.toLowerCase()
        )
      );
    }
  }, [categoria, produtos]);

  return (
    <div className="app">
      <h1 className="new-title">
        {categoriasMapeadas[categoria.toLowerCase()] || categoria}
      </h1>

      {produtosFiltrados.length > 0 ? (
        produtosFiltrados.map((item) => (
          <div key={item.id} className="card-newproduct">
            <img className="img-newproduct" src={item.image} alt={item.nome} />

            <div className="card-price">
              <h1>
                {item.nome.charAt(0).toUpperCase() + item.nome.slice(1)}
              </h1>
              <h2>R$ {item.preco.toFixed(2)}</h2>
              <p>
                R$ {item.preco.toFixed(2)} à vista com desconto ou 3x R$ {(item.preco / 3).toFixed(2)} sem juros
              </p>
              {onEdit && (
                <button className="button-buy" onClick={() => onEdit(item)}>
                  Editar
                </button>
              )}
            </div>
          </div>
        ))
      ) : (
        <p>Carregando produtos...</p>
      )}

      {/* Listagem de produtos com botão para editar */}
      <ProductsAdmin produtos={produtos} onEdit={onEdit} />
    </div>
  );
}
