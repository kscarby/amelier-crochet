import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  listarProdutos,
  criarProduto,
  atualizarProduto
} from "../productService";
import { getAuth } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";

import '../styles/ProductManager.css'

const categoriasFixas = ["lancamentos", "amigurumis", "chaveiros", "acessorios", 'todos'];

export default function ProductManager() {
  const [produtos, setProdutos] = useState([]);
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [categoria, setCategoria] = useState("");
  const [imgFile, setImgFile] = useState(null);
  const [imgPreview, setImgPreview] = useState("");
  const [editId, setEditId] = useState(null);
  const [mensagem, setMensagem] = useState("");

  const auth = getAuth();
  const user = auth.currentUser;

  const { id } = useParams();
  const navigate = useNavigate();

  // Carregar produtos existentes
  const carregarProdutos = async () => {
    const lista = await listarProdutos();
    setProdutos(lista);
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  // Se tiver ID na URL, carrega o produto para edição (opcional)
  useEffect(() => {
    if (id && produtos.length > 0) {
      const produto = produtos.find((p) => p.id === id);
      if (produto) {
        carregarProdutoParaEdicao(produto);
      }
    }
  }, [id, produtos]);

  // Função para carregar produto no formulário para edição
  const carregarProdutoParaEdicao = (produto) => {
    setEditId(produto.id);
    setNome(produto.nome);
    setPreco(produto.preco);
    setCategoria(produto.categoria || "");
    setImgPreview(produto.image || "");
    setImgFile(null);
  };

  const limparFormulario = () => {
    setEditId(null);
    setNome("");
    setPreco("");
    setCategoria("");
    setImgFile(null);
    setImgPreview("");
  };

  // Upload da imagem para o Firebase Storage
  const uploadImagem = async (file) => {
    const storageRef = ref(storage, `produtos/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
  };

  // Salvar produto (novo ou edição)
  const salvarProduto = async (e) => {
    e.preventDefault();

    if (!nome.trim() || !preco || !categoria) {
      setMensagem("❌ Preencha todos os campos.");
      return;
    }

    try {
      let imgUrl = imgPreview;

      if (imgFile) {
        imgUrl = await uploadImagem(imgFile);
      }

      const produto = {
        nome,
        preco: parseFloat(preco),
        categoria,
        image: imgUrl,
      };

      if (editId) {
        await atualizarProduto(editId, produto);
        setMensagem("✅ Produto atualizado com sucesso!");
      } else {
        await criarProduto(produto);
        setMensagem("✅ Produto cadastrado com sucesso!");
      }

      limparFormulario();
      carregarProdutos();

      setTimeout(() => navigate("/admin"), 1500);
    } catch (erro) {
      console.error("Erro ao salvar:", erro);
      setMensagem("❌ Erro ao salvar produto.");
    }

    setTimeout(() => setMensagem(""), 3000);
  };

  return (
    <div className="container-product-manager">
      <h2>{editId ? "Editar Produto" : "Cadastrar Produto"}</h2>

      <form className="form-product-manager" onSubmit={salvarProduto}>
        <input
          className="input-product-manager"
          type="text"
          placeholder="Nome do Produto"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />

        <input
          className="input-product-manager"
          type="number"
          placeholder="Preço"
          min="0"
          step="0.01"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
          required
        />

        <select
          className="input-product-manager"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          required
        >
          <option value="" disabled>
            Selecione a categoria
          </option>
          {categoriasFixas.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>

        <input
          className="input-product-manager"
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files[0]) {
              setImgFile(e.target.files[0]);
              setImgPreview(URL.createObjectURL(e.target.files[0]));
            }
          }}
        />

        {imgPreview && (
          <img src={imgPreview} alt="Preview" className="preview-image" />
        )}

        <button className="button-product-manager" type="submit">
          {editId ? "Atualizar Produto" : "Cadastrar Produto"}
        </button>

        {editId && (
          <button
            type="button"
            className="button-product-manager cancel-button"
            onClick={() => {
              limparFormulario();
              navigate("/admin");
            }}
          >
            Cancelar
          </button>
        )}
      </form>

      {mensagem && <p className="mensagem-sucesso">{mensagem}</p>}
    </div>
  );
}
