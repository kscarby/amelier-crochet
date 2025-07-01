import React, { useState } from 'react';
import { login } from '../services/authService';
import { useNavigate, useLocation } from 'react-router-dom';
import "../styles/Login.css";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);

      // Redirecionar para a página anterior, se existir, senão para a home
      const destino = location.state?.from || '/';
      navigate(destino);
    } catch {
      setError('Email ou senha inválidos');
    }
  };

  return (
    <div className='container-form-login'>
      <form className='form-login' onSubmit={handleSubmit}>
        <h2 className='form-h2'>Entrar</h2>
        <input 
          className='form-input'
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          required 
        />
        <input 
          className='form-input'
          type="password" 
          placeholder="Senha" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          required 
        />
        <button className='button-buy' type="submit">Entrar</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
}
