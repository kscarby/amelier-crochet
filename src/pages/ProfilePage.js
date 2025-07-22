// ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../AuthContext';
import InputMask from 'react-input-mask';
import '../styles/BuyPage.css';

const ProfilePage = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    email: '', nome: '', cpf: '', telefone: '', dataNascimento: '',
    endereco: '', numero: '', bairro: '', cidade: '', estado: '', cep: ''
  });
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setFormData({ email: user.email, ...snap.data() });
        } else {
          setFormData(prev => ({ ...prev, email: user.email }));
        }
      }
    };
    fetchData();
  }, [user]);

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

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await setDoc(doc(db, 'users', user.uid), {
        ...formData,
        atualizadoEm: new Date(),
      });
      setSuccess(true);
      setEditMode(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Erro ao salvar:', error);
    }
  };

  return (
    <div className="container-form-payment">
      <h1 className="new-title">Meu Perfil</h1>
      <div className="container-form-inputs">
        {user && (
          <form className="form-login" onSubmit={handleSave}>
            <h2 className="form-title-h2">Dados Pessoais</h2>

            <div className="input-wrapper">
              <p className="floating-label">Email</p>
              <input className="form-input" type="email" name="email" value={formData.email} readOnly />
            </div>
            {errors.email && <span className="error">{errors.email}</span>}

            <div className="input-wrapper">
              <p className="floating-label">Nome completo</p>
              <input className="form-input" type="text" name="nome" value={formData.nome} onChange={handleChange} required disabled={!editMode} />
            </div>

            <div className="input-wrapper">
              <p className="floating-label">CPF</p>
              <InputMask className="form-input" mask="999.999.999-99" name="cpf" value={formData.cpf} onChange={handleChange} required disabled={!editMode} />
            </div>
            {errors.cpf && <span className="error">{errors.cpf}</span>}

            <div className="input-wrapper">
              <p className="floating-label">Telefone</p>
              <InputMask className="form-input" mask="(99) 99999-9999" name="telefone" value={formData.telefone} onChange={handleChange} required disabled={!editMode} />
            </div>
            {errors.telefone && <span className="error">{errors.telefone}</span>}

            <div className="input-wrapper">
              <p className="floating-label">Data de nascimento</p>
              <input className="form-input" type="date" name="dataNascimento" value={formData.dataNascimento} onChange={handleChange} required disabled={!editMode} />
            </div>

            <div className="input-wrapper">
              <p className="floating-label">Endereço</p>
              <input className="form-input" type="text" name="endereco" value={formData.endereco} onChange={handleChange} required disabled={!editMode} />
            </div>

            <div className="input-wrapper">
              <p className="floating-label">Número</p>
              <input className="form-input" type="text" name="numero" value={formData.numero} onChange={handleChange} required disabled={!editMode} />
            </div>

            <div className="input-wrapper">
              <p className="floating-label">Bairro</p>
              <input className="form-input" type="text" name="bairro" value={formData.bairro} onChange={handleChange} required disabled={!editMode} />
            </div>

            <div className="input-wrapper">
              <p className="floating-label">Cidade</p>
              <input className="form-input" type="text" name="cidade" value={formData.cidade} onChange={handleChange} required disabled={!editMode} />
            </div>

            <div className="input-wrapper">
              <p className="floating-label">Estado</p>
              <select className="form-input" name="estado" value={formData.estado} onChange={handleChange} required disabled={!editMode}>
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
              <InputMask className="form-input" mask="99999-999" name="cep" value={formData.cep} onChange={handleChange} required disabled={!editMode} />
            </div>
            {errors.cep && <span className="error">{errors.cep}</span>}

            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
              <button className="button-buy" type="button" onClick={() => setEditMode(true)}>Editar</button>
              <button className="button-buy" type="submit" disabled={!editMode}>Salvar alterações</button>
            </div>
            {success && <p style={{ color: 'green', marginTop: '10px' }}>Alterações salvas com sucesso!</p>}
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
