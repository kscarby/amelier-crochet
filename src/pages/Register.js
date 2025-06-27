import React, { useState } from 'react';
import { register } from '../services/authService';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    <div className='container-form'>
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
        <button className='button-buy' type="submit">Criar Conta</button>
        {error && <p style={{color:'red'}}>{error}</p>}
      </form>
    </div>
  );
}
