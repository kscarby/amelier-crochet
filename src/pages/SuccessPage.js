import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const SuccessPage = () => {

  const location = useLocation();
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const carregarPedido = async () => {

      const params = new URLSearchParams(location.search);
      const pedidoId = params.get("pedido");

      if (!pedidoId) {
        setLoading(false);
        return;
      }

      try {

        const pedidoRef = doc(db, "pedidos", pedidoId);
        const snap = await getDoc(pedidoRef);

        if (snap.exists()) {
          setPedido(snap.data());
        }

        localStorage.removeItem("cart");

      } catch (error) {
        console.error("Erro ao carregar pedido:", error);
      }

      setLoading(false);
    };

    carregarPedido();

  }, [location]);

  if (loading) {
    return <h2>Verificando pagamento...</h2>;
  }

  if (!pedido) {
    return <h2>Pedido não encontrado.</h2>;
  }

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>Pagamento realizado com sucesso 🎉</h1>

      <p>
        Obrigado pela sua compra!  
        Seu download está disponível abaixo.
      </p>

      {pedido.produtos?.map((produto, index) => (
        <div key={index} style={{ marginTop: "20px" }}>
          <h3>{produto.nome || produto.title}</h3>

          <a
            href={produto.pdf}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              padding: "12px 20px",
              background: "#28a745",
              color: "#fff",
              textDecoration: "none",
              borderRadius: "6px"
            }}
          >
            Baixar Receita
          </a>
        </div>
      ))}

    </div>
  );
};

export default SuccessPage;