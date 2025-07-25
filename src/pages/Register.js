import React, { useState } from 'react';
import { register } from '../services/authService';
import { useNavigate } from 'react-router-dom';

import "../styles/Register.css";

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acepted, setAcepted] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(email, password);
      navigate('/admin');
    } catch {
      setError('Erro ao criar conta');
    }
  };

  return (
    <div className='container-form-login'>
      <form className='form-login' onSubmit={handleSubmit}>
        <h2 className='form-h2'>Criar Conta</h2>
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
        <div className='form-terms'>
          <input 
            className='form-input-terms'
            type="checkbox"
            value={acepted}
            onChange={e => setAcepted(e.target.value)} 
            required 
          />
          <p className='p-terms'>Eu aceito os </p>
          <button className='bt-terms'>termos de uso</button><p className='p-terms'> e </p>
          <button className='bt-terms'>política de privacidade</button>
          
        </div>

        <button className='button-buy' type="submit">Criar Conta</button>
        {error && <p style={{color:'red'}}>{error}</p>}
      </form>
    </div>
  );
}
