
# 🧸 Amelier Crochet - Loja de Amigurumis

Loja online de amigurumis, chaveiros, acessórios e produtos feitos à mão. Desenvolvido com **React**, **Firebase** e **CSS puro**, com painel administrativo para gerenciamento de produtos.

## ⚙️ Tecnologias utilizadas

- ⚛️ **React**
- 🔥 **Firebase (Firestore + Storage + Auth)**
- 🎨 **CSS puro e responsivo**
- 🌐 **React Router DOM**

## 📦 Funcionalidades

### 🛍️ Área do Cliente
- Visualização de produtos por categorias.
- Carrinho de compras.
- Simulação de parcelamento.
- Botão "Comprar" (opcionalmente redireciona para WhatsApp ou checkout futuro).

### 🛠️ Painel Administrativo
- Login protegido (acesso para admin).
- Cadastro de novos produtos.
- Edição de produtos existentes.
- Upload de imagens direto para Firebase Storage.
- Exclusão de produtos.
- Listagem dos produtos por categoria.

## 🔐 Proteção de Rotas
- Apenas usuários autenticados e com permissão de administrador podem acessar as rotas do painel administrativo (`/admin`).

## 🗂️ Estrutura de pastas

```
src/
│
├── components/         # Componentes reutilizáveis (Toolbar, Footer, ProductCard)
├── pages/              # Páginas principais (Home, ProductsPage, ProductsAdmin, ProductManager, Login, Register)
├── routes/             # Rotas protegidas (AdminRoute)
├── services/           # Serviços auxiliares (productService.js)
├── styles/             # Arquivos CSS
├── firebase.js         # Configuração do Firebase
├── App.jsx             # Estrutura de rotas e layout
└── index.jsx           # Ponto de entrada
```

## 🔥 Configuração do Firebase

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/).
2. Habilite:
   - Firestore Database
   - Storage
   - Authentication (Email/Senha)
3. No Firestore, crie uma coleção chamada `produtos`.
4. Na aba Storage, configure as regras de CORS (se necessário) e permissões.
5. Configure seu arquivo `firebase.js` com suas credenciais:

```javascript
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_AUTH_DOMAIN",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_STORAGE_BUCKET",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SEU_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
```

## 🚀 Como rodar o projeto

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio
```

2. Instale as dependências:

```bash
npm install
```

3. Execute o projeto:

```bash
npm run start
```

4. Acesse:

```
http://localhost:3000
```

## 🛠️ Scripts úteis

```bash
npm run start       # Inicia o servidor de desenvolvimento
npm run build       # Gera uma versão otimizada para produção
npm run deploy      # (Opcional) Script de deploy se configurado
```

## 💖 Créditos

Projeto desenvolvido por **Amelier Crochet** 🧶 com amor, café e muitos pontos baixos!

## 📜 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.
