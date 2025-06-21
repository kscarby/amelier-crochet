import React, { useEffect, useState, useRef } from "react";
import { db, storage } from "../firebase";
import {
  doc,
  addDoc,
  updateDoc,
  collection,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function ProductManager({ produtoSelecionado, onSave, onCancel }) {
  const [form, setForm] = useState({
    nome: "",
    preco: "",
    image: "",
    categoria: "lancamentos",
  });

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (produtoSelecionado) {
      setForm(produtoSelecionado);
      setFile(null);
    } else {
      setForm({
        nome: "",
        preco: "",
        image: "",
        categoria: "lancamentos",
      });
      setFile(null);
    }
  }, [produtoSelecionado]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setUploading(true);
      let imageUrl = form.image;

      // 🔥 Se tiver arquivo novo, faz upload para o Storage
      if (file) {
        const storageRef = ref(storage, `produtos/${file.name}`);
        await uploadBytes(storageRef, file);
        imageUrl = await getDownloadURL(storageRef);
      }

      if (form.id) {
        const docRef = doc(db, "produtos", form.id);
        await updateDoc(docRef, {
          nome: form.nome,
          preco: Number(form.preco),
          image: imageUrl,
          categoria: form.categoria,
        });
      } else {
        await addDoc(collection(db, "produtos"), {
          nome: form.nome,
          preco: Number(form.preco),
          image: imageUrl,
          categoria: form.categoria,
        });
      }

      onSave();
      setForm({
        nome: "",
        preco: "",
        image: "",
        categoria: "lancamentos",
      });
      setFile(null);
    } catch (error) {
      console.error("Erro ao salvar:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="product-manager">
      <h2>{form.id ? "Editar Produto" : "Novo Produto"}</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nome:
          <input
            name="nome"
            value={form.nome}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Preço:
          <input
            type="number"
            name="preco"
            value={form.preco}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Imagem:
          <div className="file-upload">
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <button
              type="button"
              className="custom-file-button"
              onClick={() => fileInputRef.current.click()}
            >
              {file ? "Imagem Selecionada" : "Escolher Arquivo"}
            </button>
            {file && <span style={{ marginLeft: 8 }}>{file.name}</span>}
          </div>

          {(file || form.image) && (
            <div style={{ marginTop: 10 }}>
              <img
                src={file ? URL.createObjectURL(file) : form.image}
                alt="Preview"
                style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 8 }}
              />
            </div>
          )}
        </label>

        <label>
          Categoria:
          <select
            name="categoria"
            value={form.categoria}
            onChange={handleChange}
          >
            <option value="lancamentos">Lançamentos</option>
            <option value="amigurumis">Amigurumis</option>
            <option value="chaveiros">Chaveiros</option>
            <option value="acessorios">Acessórios</option>
          </select>
        </label>

        <div className="buttons-actions">
          <button type="submit" className="button-edit" disabled={uploading}>
            {uploading ? "Salvando..." : form.id ? "Atualizar" : "Adicionar"}
          </button>
          {form.id && (
            <button
              type="button"
              className="button-delete"
              onClick={onCancel}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
