import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { logout } from "../services/authService";

import "../styles/Header.css";

export default function Header({ setCart }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout(); // faz logout no Firebase
    setCart([]); // limpa carrinho do estado
    localStorage.removeItem("cart"); // se estiver usando localStorage
    navigate("/login"); // redireciona para login
  };

  return (
    <header style={{ padding: "10px", backgroundColor: "#F7DCB9" }}>
      <Link to="/" className="button-home">Home</Link>{" "}

      {user?.isAdmin && (
        <Link to="/admin" className="button-admin">Admin</Link>
      )}

      {!user ? (
        <>
          <Link to="/login" className="button-login">Login</Link>{" "}
          <Link to="/register" className="button-register">Register</Link>
        </>
      ) : (
        <>
          <span>Bem-vindo, {user.email}</span>{" "}
          <Link to="/perfil" className="button-profile">Meu Perfil</Link>
          <button onClick={handleLogout} className="button-logout">Sair</button>
        </>
      )}
    </header>
  );
}
