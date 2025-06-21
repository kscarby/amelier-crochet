import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { logout } from '../services/authService';

export default function Header() {
  const { user } = useAuth();

  return (
    <header style={{ padding: '10px', backgroundColor: '#F7DCB9' }}>
      <Link to="/">Home</Link> |{" "}
      <Link to="/admin">Admin</Link> |{" "}
      {!user && (
        <>
          <Link to="/login">Login</Link> |{" "}
          <Link to="/register">Register</Link>
        </>
      )}
      {user && (
        <>
          <span> Bem-vindo, {user.email} </span> |{" "}
          <button onClick={logout}>Sair</button>
        </>
      )}
    </header>
  );
}
