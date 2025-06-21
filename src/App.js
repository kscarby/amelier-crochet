import './App.css';
import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Components
import Toolbar from './components/Toolbar';
import Home from './pages/Home';
import Header from './pages/Header';
import Footer from './components/Footer';
import AdminRoute from './routes/AdminRoute';
import ProductsPage from './pages/ProductsPage';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminPage from './pages/AdminPage'; // ✅ Página que junta ProductManager + ProductsAdmin
import SearchPage from './pages/SearchPage';

function App() {
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");

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
        <Header />
        <Toolbar cart={cart} setCart={setCart} onSearch={setSearch} />

        <Routes>
          {/* Rotas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/products/:categoria"
            element={<ProductsPage cart={cart} setCart={setCart} addToCart={handleAddToCart} />}
          />

          {/* Rota administrativa única */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            }
          />

          <Route
            path="/buscar"
            element={
              <SearchPage
                search={search}
                addToCart={handleAddToCart}  // <- usa handleAddToCart aqui!
              />
            }
          />
        </Routes>
      </BrowserRouter>

      <Footer />
    </div>
  );
}


export default App;
