import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { logout } from '../services/authService';

import '../styles/Header.css'

export default function Header() {
  const { user } = useAuth();

  return (
    <header style={{ padding: '10px', backgroundColor: '#F7DCB9' }}>
      <Link to="/" className='button-home'>Home</Link> {" "}
      <Link to="/admin" className='button-admin'>Admin</Link> {" "}
      {!user && (
        <>
          <Link to="/login" className='button-login'>Login</Link> {" "}
          <Link to="/register" className='button-register'>Register</Link>
        </>
      )}
      {user && (
        <>
          <span> Bem-vindo, {user.email} </span> {" "}
          <button onClick={logout} className='button-logout'>Sair</button>
        </>
      )}
    </header>
  );
}
