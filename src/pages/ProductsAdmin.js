import React from "react";

export default function ProductsAdmin({ produtos, onEdit, onDelete }) {
  return (
    <div className="products-admin">
      <h2>Lista de Produtos</h2>
      <table className="products-table">
        <thead>
          <tr>
            <th>Imagem</th>
            <th>Nome</th>
            <th>Preço</th>
            <th>Categoria</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map((item) => (
            <tr key={item.id}>
              <td>
                <img
                  src={item.image}
                  alt={item.nome}
                  style={{ width: 50, height: 50, objectFit: "cover" }}
                />
              </td>
              <td>{item.nome}</td>
              <td>R$ {item.preco.toFixed(2)}</td>
              <td>{item.categoria}</td>
              <td>
                <button className="button-edit" onClick={() => onEdit(item)}>
                  Editar
                </button>
                <button
                  className="button-delete"
                  onClick={() => onDelete(item)}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
