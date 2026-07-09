import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Components
import Toolbar from './components/Toolbar.js';
import Home from './pages/Home.js';
import Header from './pages/Header.js';
import Footer from './components/Footer.js';
import AdminRoute from './routes/AdminRoute';
import ProductsPage from './pages/ProductsPage.js';
import Login from './pages/Login.js';
import Register from './pages/Register.js';
import AdminPage from './pages/AdminPage.js';
import SearchPage from './pages/SearchPage.js';
import BuyPage from './pages/BuyPage.js';
import Recovery from './pages/Recovery.js'
import ProfilePage from './pages/ProfilePage.js';
import DetailsPage from './pages/DetailsPage.js';
import SuccessPage from "./pages/SuccessPage.js";
import OrdersPage from './pages/OrdersPage.js';

function App() {
  // Inicializa o carrinho a partir do localStorage, se existir
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [search, setSearch] = useState("");


  // Atualiza o localStorage toda vez que o cart mudar
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const handleAddToCart = (produto) => {
    setCart((prevCart) => {
      const itemNoCarrinho = prevCart.find((item) => item.id === produto.id);
      if (itemNoCarrinho) {
        return prevCart.map((item) =>
          item.id === produto.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...produto, quantity: 1 }];
      }
    });
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Header setCart={setCart} />
        <Toolbar cart={cart} setCart={setCart} onSearch={setSearch} />
        
        <Routes>
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/perfil" element={<ProfilePage />} />
          <Route path="/" element={<Home addToCart={handleAddToCart} />} />
          <Route path="/login" element={<Login />} />
          <Route path='/recovery' element={<Recovery/>} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/products/:categoria"
            element={<ProductsPage cart={cart} setCart={setCart} addToCart={handleAddToCart} />}
          />
          <Route path="/payment" element={<BuyPage cart={cart} />} />
          <Route path="/details/:id" element={<DetailsPage addToCart={handleAddToCart} />} />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
            <AdminRoute>
              <OrdersPage />
            </AdminRoute>
            }
          />
          <Route
            path="/buscar"
            element={<SearchPage search={search} addToCart={handleAddToCart} />}
          />
        </Routes>
      </BrowserRouter>

      <Footer />
    </div>
  );
}

export default App;
