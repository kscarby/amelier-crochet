import React, { useState } from 'react';
import { auth } from '../firebase';  // ajuste o caminho
import { sendPasswordResetEmail } from 'firebase/auth';

const Recovery = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      await sendPasswordResetEmail(auth, email, {
        url: 'https://amelier-crochet.web.app/login'  // coloque aqui a sua URL real
      });
      setMessage(`Email de recuperação enviado para ${email}. Verifique sua caixa de entrada.`);
      setEmail('');
    } catch (err) {
      setError('Erro ao enviar email. Verifique o endereço e tente novamente.');
      console.error(err);
    }
  };

  return (
    <div className='container-form-login'>
      <form className='form-login' onSubmit={handleSubmit}>
        <h2 className='form-h2'>Recuperação de senha</h2>

        <input 
          className='form-input'
          type="email" 
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required 
        />

        {message && <p style={{ color: 'green', marginTop: '10px' }}>{message}</p>}
        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

        <button className='button-buy' type="submit">Enviar</button>
      </form>
    </div>
  );
}

export default Recovery;
