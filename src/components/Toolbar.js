import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Badge, Box, Drawer, Button, List, ListItem, IconButton, Divider, Tooltip
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import { green } from "@mui/material/colors";

import "../styles/Toolbar.css";

const Toolbar = ({ cart, setCart, onSearch }) => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const theme = createTheme({
    palette: {
      sage: { main: "#B5C18E" },
      beige: { main: "#F7DCB9" },
    },
  });

  const ColorButton = styled(Button)(() => ({
    color: "#fff",
    backgroundColor: green[300],
    "&:hover": { backgroundColor: green[400] },
    fontFamily: "Zain",
    fontSize: "18px",
  }));

  const updateQuantity = (id, amount) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + amount } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const DeleteItem = (id) => {
    const confirm = window.confirm("Remover item?");
    if (confirm) {
      setCart((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim() === "") return;
    navigate(`/buscar?term=${encodeURIComponent(searchInput.trim())}`);
    setSearchInput("");
  };

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="toolbar-app">
      {/* Top bar */}
      <div className="toolbar">
        <IconButton
          className="menu-button"
          onClick={() => setMenuOpen(true)}
          aria-label="Abrir menu"
        >
          <MenuIcon />
        </IconButton>

        <h1 className="h1-logo" onClick={() => navigate("/")}>
          Amelier Crochet
        </h1>

        <form onSubmit={handleSubmit} className="search-form">
          <input
            type="text"
            placeholder="Pesquisar..."
            value={searchInput}
            onChange={handleSearchChange}
            className="toolbar-filter"
            autoComplete="off"
          />
        </form>

        <ThemeProvider theme={theme}>
          <Badge badgeContent={cart.length} color="beige">
            <button
              className="toolbar-shopping"
              onClick={() => setCartOpen(true)}
              aria-label="Abrir carrinho"
            />
          </Badge>
        </ThemeProvider>
      </div>

      {/* Navbar abaixo da barra */}
      <div className="toolbar__">
        <nav className="navbar">
          <button className="navbar-news" onClick={() => navigate("/products/lancamentos")}>
            Lançamentos
          </button>
          <button className="navbar-amigurumis" onClick={() => navigate("/products/amigurumis")}>
            Amigurumis
          </button>
          <button className="navbar-keychains" onClick={() => navigate("/products/chaveiros")}>
            Chaveiros
          </button>
          <button className="navbar-accessories" onClick={() => navigate("/products/acessorios")}>
            Acessórios
          </button>
          <button className="navbar-all" onClick={() => navigate("/products/todos")}>
            Todos
          </button>
        </nav>
      </div>

      {/* Drawer do carrinho */}
      <Drawer anchor="right" open={cartOpen} onClose={() => setCartOpen(false)}>
        <Box sx={{ width: 320, p: 2 }}>
          <h2>Meu Carrinho</h2>
          <Divider />
          {cart.length === 0 ? (
            <p>Carrinho vazio.</p>
          ) : (
            <List>
              {cart.map((item) => (
                <ListItem key={item.id} sx={{ display: "flex", flexDirection: "column", alignItems: "start" }}>
                  <img
                    src={item.image}
                    alt={item.nome || item.title}
                    style={{ width: "100%", maxWidth: 120, borderRadius: 8 }}
                  />
                  <h4>{item.nome || item.title}</h4>
                  <Box>
                    <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, +1)}>+</button>
                  </Box>
                  <p>R$ {(item.preco || item.price) * item.quantity}</p>
                  <Tooltip title="Remover">
                    <IconButton onClick={() => DeleteItem(item.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </ListItem>
              ))}
            </List>
          )}
          <Divider />
          <ColorButton fullWidth onClick={() => alert("Finalizar Compra em breve!")}>
            Finalizar Compra
          </ColorButton>
        </Box>
      </Drawer>

      {/* Drawer do menu mobile */}
      <Drawer anchor="left" open={menuOpen} onClose={() => setMenuOpen(false)}>
        <Box sx={{ width: 250, p: 2 }}>
          <List>
            <ListItem  onClick={() => {navigate("/products/lancamentos"); setMenuOpen(false);}}>Lançamentos</ListItem>
            <ListItem  onClick={() => {navigate("/products/amigurumis"); setMenuOpen(false);}}>Amigurumis</ListItem>
            <ListItem  onClick={() => {navigate("/products/chaveiros"); setMenuOpen(false);}}>Chaveiros</ListItem>
            <ListItem  onClick={() => {navigate("/products/acessorios"); setMenuOpen(false);}}>Acessórios</ListItem>
            <ListItem  onClick={() => {navigate("/products/todos"); setMenuOpen(false);}}>Todos</ListItem>
          </List>
        </Box>
      </Drawer>
    </div>
  );
};

export default Toolbar;
