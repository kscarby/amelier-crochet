import React, { useEffect, useState, useRef } from "react";
import { db, storage } from "../firebase";
import { doc, addDoc, updateDoc, collection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function ProductManager({ produtoSelecionado, onSave, onCancel }) {
  const [form, setForm] = useState({
    nome: "",
    preco: "",
    image: "",
    pdf: "",
    categoria: "lancamentos",
  });

  const [imageFile, setImageFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const imageInputRef = useRef(null);
  const pdfInputRef = useRef(null);

  useEffect(() => {
    if (produtoSelecionado) {
      setForm(produtoSelecionado);
      setImageFile(null);
      setPdfFile(null);
    } else {
      setForm({
        nome: "",
        preco: "",
        image: "",
        pdf: "",
        categoria: "lancamentos",
      });
      setImageFile(null);
      setPdfFile(null);
    }
  }, [produtoSelecionado]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) setImageFile(selectedFile);
  };

  const handlePdfChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) setPdfFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = form.image;
      let pdfUrl = form.pdf;

      // Upload de imagem se houver
      if (imageFile) {
        const storageRef = ref(storage, `produtos/${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      // Upload de PDF se houver
      if (pdfFile) {
        const storageRef = ref(storage, `produtos/${pdfFile.name}`);
        await uploadBytes(storageRef, pdfFile);
        pdfUrl = await getDownloadURL(storageRef);
      }

      const produtoData = {
        nome: form.nome,
        preco: Number(form.preco),
        image: imageUrl,
        pdf: pdfUrl,
        categoria: form.categoria,
      };

      if (form.id) {
        const docRef = doc(db, "produtos", form.id);
        await updateDoc(docRef, produtoData);
      } else {
        await addDoc(collection(db, "produtos"), produtoData);
      }

      onSave();
      setForm({
        nome: "",
        preco: "",
        image: "",
        pdf: "",
        categoria: "lancamentos",
      });
      setImageFile(null);
      setPdfFile(null);
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
          <input name="nome" value={form.nome} onChange={handleChange} required />
        </label>

        <label>
          Preço:
          <input type="number" name="preco" value={form.preco} onChange={handleChange} required />
        </label>

        <label>
          PDF:
          <div className="file-upload">
            <input
              type="file"
              accept="application/pdf"
              style={{ display: "none" }}
              ref={pdfInputRef}
              onChange={handlePdfChange}
            />
            <button className="button-edit" type="button" onClick={() => pdfInputRef.current.click()}>
              {pdfFile ? "PDF Selecionado" : "Escolher PDF"}
            </button>
            {pdfFile && <span style={{ marginLeft: 8 }}>{pdfFile.name}</span>}
            {!pdfFile && form.pdf && <span style={{ marginLeft: 8 }}>Arquivo atual: {form.pdf.split("/").pop()}</span>}
          </div>
        </label>

        <label>
          Imagem:
          <div className="file-upload">
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={imageInputRef}
              onChange={handleImageChange}
            />
            <button className="button-edit" type="button" onClick={() => imageInputRef.current.click()}>
              {imageFile ? "Imagem Selecionada" : "Escolher Imagem"}
            </button>
            {imageFile && <span style={{ marginLeft: 8 }}>{imageFile.name}</span>}
          </div>
          {(imageFile || form.image) && (
            <div style={{ marginTop: 10 }}>
              <img
                src={imageFile ? URL.createObjectURL(imageFile) : form.image}
                alt="Preview"
                style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 8 }}
              />
            </div>
          )}
        </label>

        <label>
          Categoria:
          <select name="categoria" value={form.categoria} onChange={handleChange}>
            <option value="lancamentos">Lançamentos</option>
            <option value="amigurumis">Amigurumis</option>
            <option value="chaveiros">Chaveiros</option>
            <option value="acessorios">Acessórios</option>
            <option value="receitas">Receitas</option>
          </select>
        </label>

        <div className="buttons-actions">
          <button className="button-edit" type="submit" disabled={uploading}>
            {uploading ? "Salvando..." : form.id ? "Atualizar" : "Adicionar"}
          </button>
          {form.id && <button type="button" onClick={onCancel}>Cancelar</button>}
        </div>
      </form>
    </div>
  );
}
