import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InputMask from 'react-input-mask';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../AuthContext';
import '../styles/BuyPage.css';

const BuyPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    nome: '',
    cpf: '',
    telefone: '',
    dataNascimento: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/payment' } });
    } else {
      setFormData(prev => ({ ...prev, email: user.email || '' }));
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.includes('@')) newErrors.email = 'Email inválido';
    if (formData.cpf.replace(/\D/g, '').length !== 11) newErrors.cpf = 'CPF incompleto';
    if (formData.telefone.replace(/\D/g, '').length < 10) newErrors.telefone = 'Telefone incompleto';
    if (formData.cep.replace(/\D/g, '').length !== 8) newErrors.cep = 'CEP inválido';
    if (!formData.estado) newErrors.estado = 'Selecione um estado';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      console.log('Enviando para Firestore:', formData);

      await addDoc(collection(db, 'compras'), {
        ...formData,
        criadoEm: new Date(),
        uid: user?.uid || null
      });

      alert('Compra salva com sucesso no Firestore!');

      setFormData({
        email: user.email || '',
        nome: '',
        cpf: '',
        telefone: '',
        dataNascimento: '',
        numero: '',
        bairro: '',
        endereco: '',
        cidade: '',
        estado: '',
        cep: ''
      });
    } catch (error) {
      console.error('Erro ao salvar:', error.code, error.message);
      alert('Erro ao finalizar compra.');
    }
  };

  return (
    <div className="container-form-payment">
      <h1 className="new-title">Finalizar compra</h1>
      <div className='container-form-inputs'>
        {user && (
        <form className="form-login" onSubmit={handlePayment}>
          <h2 className='form-title-h2'>Dados Pessoais</h2>

          <div className="input-wrapper">
            <p className="floating-label">Email</p>
            <input
              className="form-input"
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              readOnly
            />
          </div>
          {errors.email && <span className="error">{errors.email}</span>}

          <div className="input-wrapper">
            <p className="floating-label">Nome completo</p>
            <input
              className="form-input"
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-wrapper">
            <p className="floating-label">CPF</p>
            <InputMask
              className="form-input"
              mask="999.999.999-99"
              placeholder="000.000.000-00"
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
              required
            />
          </div>
          {errors.cpf && <span className="error">{errors.cpf}</span>}

          <div className="input-wrapper">
            <p className="floating-label">Telefone</p>
            <InputMask
              className="form-input"
              mask="(99) 99999-9999"
              placeholder="(00) 00000-0000"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              required
            />
          </div>
          {errors.telefone && <span className="error">{errors.telefone}</span>}

          <div className="input-wrapper">
            <p className="floating-label">Data de nascimento</p>
            <input
              className="form-input"
              type="date"
              name="dataNascimento"
              value={formData.dataNascimento}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-wrapper">
            <p className="floating-label">Endereço</p>
            <input
              className="form-input"
              type="text"
              name="endereco"
              value={formData.endereco}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-wrapper">
            <p className="floating-label">Número</p>
            <input
              className="form-input"
              type="text"
              name="endereco"
              value={formData.numero}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-wrapper">
            <p className="floating-label">Bairro</p>
            <input
              className="form-input"
              type="text"
              name="endereco"
              value={formData.bairro}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-wrapper">
            <p className="floating-label">Cidade</p>
            <input
              className="form-input"
              type="text"
              name="cidade"
              value={formData.cidade}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-wrapper">
            <p className="floating-label">Estado</p>
            <select
              className="form-input"
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              required
            >
              <option value="">Selecione o estado</option>
              {[
                "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG",
                "PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"
              ].map(uf => (
                <option key={uf} value={uf}>{uf}</option>
              ))}
            </select>
          </div>
          {errors.estado && <span className="error">{errors.estado}</span>}

          <div className="input-wrapper">
            <p className="floating-label">CEP</p>
            <InputMask
              className="form-input"
              mask="99999-999"
              placeholder="00000-000"
              name="cep"
              value={formData.cep}
              onChange={handleChange}
              required
            />
          </div>
          {errors.cep && <span className="error">{errors.cep}</span>}

          <button className="button-buy" type="submit">Enviar</button>
        </form>
      )}        
      </div>      
    </div>
  );
};

export default BuyPage;
