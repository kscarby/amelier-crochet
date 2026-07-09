// BuyPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import InputMask from 'react-input-mask';
import { collection, addDoc, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase.js';
import { useAuth } from '../AuthContext.js';
import axios from 'axios';
import '../styles/BuyPage.css';

const BuyPage = ({ cart: propCart }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const cartFromStorage = JSON.parse(localStorage.getItem('cart')) || [];
  const cart = location.state?.cart || propCart || cartFromStorage;

  const [formData, setFormData] = useState({
    email: '', nome: '', cpf: '', telefone: '', dataNascimento: '',
    endereco: '', numero: '', bairro: '', cidade: '', estado: '', cep: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/payment' } });
    } else {
      const fetchUserData = async () => {
        const docRef = doc(db, 'users', user.uid);
        const snap = await getDoc(docRef);
        if (snap.exists()) setFormData({ email: user.email, ...snap.data() });
        else setFormData(prev => ({ ...prev, email: user.email }));
      };
      fetchUserData();
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!cart || cart.length === 0) {
      alert('Seu carrinho está vazio.');
      navigate('/');
    }
  }, [cart, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.includes('@')) newErrors.email = 'Email inválido';
    if (formData.cpf.replace(/\D/g, '').length !== 11) newErrors.cpf = 'CPF inválido';
    if (formData.telefone.replace(/\D/g, '').length < 10) newErrors.telefone = 'Telefone inválido';
    if (formData.cep.replace(/\D/g, '').length !== 8) newErrors.cep = 'CEP inválido';
    if (!formData.estado) newErrors.estado = 'Estado obrigatório';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async (e) => {
  e.preventDefault();

  if (!validate()) return;

  try {

    // 1️⃣ cria pedido no Firestore
    const pedidoRef = await addDoc(collection(db, "compras"), {
      ...formData,
      produtos: cart,
      criadoEm: new Date(),
      uid: user?.uid || null,
      status: "pendente"
    });

    const pedidoId = pedidoRef.id;

    // 2️⃣ monta itens para o Mercado Pago
    const items = cart.map(item => ({
      title: item.nome || item.title,
      quantity: Number(item.quantity) || 1,
      unit_price: Number(item.preco || item.price) || 0
    }));

    // cria preferência
    const preference = {
      items,
      back_urls: {
        success: `https://amelier-crochet.web.app/success?pedido=${pedidoId}`,
        failure: "https://amelier-crochet.web.app/erro"
      },
      auto_return: "approved",
      external_reference: pedidoId
    };

    // envia para backend (ou API)
    const response = await axios.post(
      "https://api.mercadopago.com/checkout/preferences",
      preference,
      {
        headers: {
          Authorization: `Bearer APP_USR-3114926596313854-090418-63b2fea746a382cf64e41221687800d3-2568259463`,
          "Content-Type": "application/json"
        }
      }
    );

    // redireciona para pagamento
    window.location.href = response.data.init_point;

    } catch (error) {
      console.error("Erro ao criar pagamento:", error);
      alert("Erro ao iniciar pagamento.");
    }
  };

  return (
    <div className="container-form-payment">
      <h1 className="new-title">Finalizar compra</h1>
      <div className="container-form-inputs">
        {user && (
          <form className="form-login" onSubmit={handlePayment}>
            <p className="info-note">
              Seus dados vêm do perfil. <Link to="/perfil">Editar perfil</Link>
            </p>
            <h2 className="form-title-h2">Dados Pessoais</h2>

            <div className="input-wrapper">
              <p className="floating-label">Email</p>
              <input className="form-input" type="email" name="email" value={formData.email} readOnly />
            </div>
            {errors.email && <span className="error">{errors.email}</span>}

            <div className="input-wrapper">
              <p className="floating-label">Nome completo</p>
              <input className="form-input" type="text" name="nome" value={formData.nome} onChange={handleChange} required />
            </div>

            <div className="input-wrapper">
              <p className="floating-label">CPF</p>
              <InputMask className="form-input" mask="999.999.999-99" name="cpf" value={formData.cpf} onChange={handleChange} required />
            </div>
            {errors.cpf && <span className="error">{errors.cpf}</span>}

            <div className="input-wrapper">
              <p className="floating-label">Telefone</p>
              <InputMask className="form-input" mask="(99) 99999-9999" name="telefone" value={formData.telefone} onChange={handleChange} required />
            </div>
            {errors.telefone && <span className="error">{errors.telefone}</span>}

            <div className="input-wrapper">
              <p className="floating-label">Data de nascimento</p>
              <input className="form-input" type="date" name="dataNascimento" value={formData.dataNascimento} onChange={handleChange} required />
            </div>

            <div className="input-wrapper">
              <p className="floating-label">Endereço</p>
              <input className="form-input" type="text" name="endereco" value={formData.endereco} onChange={handleChange} required />
            </div>

            <div className="input-wrapper">
              <p className="floating-label">Número</p>
              <input className="form-input" type="text" name="numero" value={formData.numero} onChange={handleChange} required />
            </div>

            <div className="input-wrapper">
              <p className="floating-label">Bairro</p>
              <input className="form-input" type="text" name="bairro" value={formData.bairro} onChange={handleChange} required />
            </div>

            <div className="input-wrapper">
              <p className="floating-label">Cidade</p>
              <input className="form-input" type="text" name="cidade" value={formData.cidade} onChange={handleChange} required />
            </div>

            <div className="input-wrapper">
              <p className="floating-label">Estado</p>
              <select className="form-input" name="estado" value={formData.estado} onChange={handleChange} required>
                <option value="">Selecione o estado</option>
                {["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG",
                  "PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"].map(uf => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
            </div>
            {errors.estado && <span className="error">{errors.estado}</span>}

            <div className="input-wrapper">
              <p className="floating-label">CEP</p>
              <InputMask className="form-input" mask="99999-999" name="cep" value={formData.cep} onChange={handleChange} required />
            </div>
            {errors.cep && <span className="error">{errors.cep}</span>}

            <button className="button-buy" type="submit">Finalizar Compra</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default BuyPage;
