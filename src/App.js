import './App.css';
import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Components
import Toolbar from './components/Toolbar';
import Home from './pages/Home';
import Header from './components/Header';
import Footer from './components/Footer';
import AdminRoute from './routes/AdminRoute';
import ProductsAdmin from './pages/ProductsAdmin';
import ProductManager from './pages/ProductManager';
import ProductsPage from './pages/ProductsPage';

function App() {
  const [cart, setCart] = useState([]);

  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Toolbar cart={cart} setCart={setCart} />

        <Routes>
          {/* Rotas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/products/:categoria" element={<ProductsPage cart={cart} setCart={setCart} />} />

          {/* Rotas de administração protegidas */}
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <ProductManager />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/:categoria" 
            element={
              <AdminRoute>
                <ProductsAdmin />
              </AdminRoute>
            } 
          />
        </Routes>
      </BrowserRouter>

      <Footer />
    </div>
  );
}

export default App;
