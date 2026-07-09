import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

import '../styles/OrdersPage.css'

export default function Orders() {
  const [orders, setOrders] = useState([]);

  const carregarPedidos = async () => {
    const snapshot = await getDocs(collection(db, "compras"));

    const pedidos = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setOrders(pedidos);
  };

  useEffect(() => {
    carregarPedidos();
  }, []);


  // Confirma pagamento
  const confirmarPagamento = async (pedido) => {
    await updateDoc(doc(db, "compras", pedido.id), {
      status: "Pago",
      pagoEm: new Date(),
    });

    carregarPedidos();
  };

  const handleDeletePedido = async (pedido) => {
    try {
      const confirmar = window.confirm(
        `Deseja excluir este pedido?`
      );

      if (!confirmar) return;

      console.log("Tentando excluir:", pedido.id);

      await deleteDoc(doc(db, "compras", pedido.id));

      console.log("Pedido excluído!");

      setOrders((prev) =>
        prev.filter((item) => item.id !== pedido.id)
      );

    } catch (error) {
      console.error("Erro ao excluir pedido:", error);
      alert("Erro ao excluir pedido: " + error.message);
    }
  };


  // Envia receita pelo WhatsApp
  const enviarWhatsapp = (pedido) => {

    const numero = pedido.telefone.replace(/\D/g, "");

    const receitas = pedido.produtos.filter(
      (produto) => produto.categoria === "receitas"
    );


    const links = receitas
      .map(
        (produto) =>
          `📄 ${produto.nome}\n${produto.pdf}`
      )
      .join("\n\n");

    console.log(pedido.produtos);
    const mensagem = `
Olá, ${pedido.nome}! 😊

Seu pagamento foi confirmado.

Segue o link da sua receita:

${links}

Qualquer dúvida, estou à disposição.

Amelier Crochet 🧶
`;

    console.log(mensagem);
    console.log(links);
    window.open(
      `https://wa.me/55${numero}?text=${encodeURIComponent(mensagem)}`,
      "_blank"
    );

  };


  return (
    <div className="orders-page">

      <h2>Pedidos</h2>


      {orders.length === 0 ? (

        <p>Nenhum pedido encontrado.</p>

      ) : (

        orders.map((pedido) => {


          const possuiReceita = pedido.produtos?.some(
            (produto) => produto.categoria === "receitas"
          );


          return (

            <div className="orders-card" key={pedido.id}>


              <p>{pedido.nome}</p>


              <p>
                Email: {pedido.email}
              </p>


              <p>
                Telefone: {pedido.telefone}
              </p>


              <p>
                Status: {pedido.status}
              </p>


              <p>
                Total: R$ {Number(pedido.total || 0).toFixed(2)}
              </p>



              <h3>Produtos</h3>


              <ul>

                {pedido.produtos?.length > 0 ? (

                  pedido.produtos.map((produto, index) => (

                    <li key={index}>
                      {produto.nome}
                    </li>

                  ))

                ) : (

                  <li>
                    Nenhum produto encontrado.
                  </li>

                )}

              </ul>
              <button
                className="button-delete"
                onClick={() => handleDeletePedido(pedido)}
              >
                Excluir
              </button>



              {pedido.status !== "Pago" && (

                <button
                  className="button-edit"
                  onClick={() => confirmarPagamento(pedido)}
                >
                  Confirmar Pagamento
                </button>

              )}



              {pedido.status === "Pago" && possuiReceita && (

                <button 
                  className="button-edit"
                  onClick={() => enviarWhatsapp(pedido)}
                >
                  Enviar Receita no WhatsApp
                </button>

              )}



            </div>

          );

        })

      )}

    </div>
  );
}