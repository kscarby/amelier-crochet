import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Badge, Box, Drawer, Button, List, ListItem, IconButton, Divider, Tooltip
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
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
          <IconButton onClick={() => setCartOpen(true)} aria-label="Abrir carrinho">
            <Badge badgeContent={cart.length} color="primary">
              <ShoppingCartIcon style={{ color: "#B5C18E" }} />
            </Badge>
          </IconButton>
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
    <h2 style={{ textAlign: "center" }}>Meu Carrinho</h2>
    <Divider sx={{ mb: 2 }} />
    {cart.length === 0 ? (
      <p style={{ textAlign: "center" }}>Seu carrinho está vazio.</p>
    ) : (
      <List>
        {cart.map((item) => (
          <ListItem
            key={item.id}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
              mb: 2,
              border: "1px solid #eee",
              borderRadius: 2,
              p: 1,
            }}
          >
            <img
              src={item.image}
              alt={item.nome || item.title}
              style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 8 }}
            />
            <h4 style={{ textAlign: "center" }}>{item.nome || item.title}</h4>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => updateQuantity(item.id, -1)}
              >
                -
              </Button>
              <span style={{ minWidth: 20, textAlign: "center" }}>{item.quantity}</span>
              <Button
                variant="outlined"
                size="small"
                onClick={() => updateQuantity(item.id, 1)}
              >
                +
              </Button>
            </Box>
            <p>
              <strong>R$ {((item.preco || item.price) * item.quantity).toFixed(2)}</strong>
            </p>
            <Tooltip title="Remover">
              <IconButton onClick={() => DeleteItem(item.id)}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>
    )}
    <Divider sx={{ mt: 2, mb: 1 }} />
    <ColorButton fullWidth onClick={() => alert("Finalizar Compra em breve!")}>
      Finalizar Compra
    </ColorButton>
  </Box>
</Drawer>


      {/* Drawer do menu mobile */}
      <Drawer anchor="left" open={menuOpen} onClose={() => setMenuOpen(false)}>
        <Box sx={{ width: 250, p: 2 }}>
          <List>
            <ListItem button onClick={() => {navigate("/products/lancamentos"); setMenuOpen(false);}}>Lançamentos</ListItem>
            <ListItem button onClick={() => {navigate("/products/amigurumis"); setMenuOpen(false);}}>Amigurumis</ListItem>
            <ListItem button onClick={() => {navigate("/products/chaveiros"); setMenuOpen(false);}}>Chaveiros</ListItem>
            <ListItem button onClick={() => {navigate("/products/acessorios"); setMenuOpen(false);}}>Acessórios</ListItem>
            <ListItem button onClick={() => {navigate("/products/todos"); setMenuOpen(false);}}>Todos</ListItem>
          </List>
        </Box>
      </Drawer>
    </div>
  );
};

export default Toolbar;
