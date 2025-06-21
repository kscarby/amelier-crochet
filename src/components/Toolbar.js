import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Badge, Box, Drawer, Button, List, Divider,
  ListItem, IconButton, Tooltip
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import { green } from "@mui/material/colors";

import "../styles/Toolbar.css";

const Toolbar = ({ cart, setCart }) => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");

  const theme = createTheme({
    palette: {
      sage: { main: "#B5C18E" },
      beige: { main: "#F7DCB9" },
      tamara: { main: "#DEAC80" },
      castain: { main: "#B99470" },
    },
  });

  const ColorButton = styled(Button)(() => ({
    color: "#fff",
    backgroundColor: green[300],
    "&:hover": { backgroundColor: green[400] },
    fontFamily: "Zain",
    fontSize: "20px",
  }));

  // Carrinho
  const [cartOpen, setCartOpen] = useState(false);

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

  // 🔍 Busca
  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim() === "") return;
    navigate(`/buscar?term=${encodeURIComponent(searchInput.trim())}`);
    setSearchInput(""); // limpa a barra após buscar (opcional)
  };

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  return (
    <div className="toolbar-app">
      <div className="toolbar">
        <h1 className="toolbar-logo" onClick={() => navigate("/")}>
          Amelier Crochet
        </h1>

        {/* 🔍 Formulário de pesquisa */}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Pesquisar..."
            value={searchInput}
            onChange={handleSearchChange}
            className="toolbar-filter"
          />
        </form>

        <div className="toolbar-buttons">
          <ThemeProvider theme={theme}>
            <Badge badgeContent={cart.length} color="beige">
              <button
                className="toolbar-shopping"
                onClick={() => setCartOpen(true)}
              ></button>
            </Badge>
          </ThemeProvider>
        </div>
      </div>

      {/* Drawer Carrinho */}
      <Drawer
        anchor="right"
        open={cartOpen}
        onClose={() => setCartOpen(false)}
      >
        <Box sx={{ width: 400, padding: 2 }}>
          <h2>Meu Carrinho</h2>
          <Divider />
          {cart.length === 0 ? (
            <p>Carrinho vazio.</p>
          ) : (
            <List>
              {cart.map((item) => (
                <ListItem key={item.id}>
                  <div className="list-item">
                    <img
                      className="img-cart"
                      src={item.image}
                      alt={item.title}
                    />
                    <h4>{item.title}</h4>
                    <IconButton onClick={() => updateQuantity(item.id, -1)}>
                      -
                    </IconButton>
                    <span>{item.quantity}</span>
                    <IconButton onClick={() => updateQuantity(item.id, +1)}>
                      +
                    </IconButton>
                    <p>R$ {(item.price * item.quantity).toFixed(2)}</p>
                    <Tooltip title="Remover">
                      <IconButton onClick={() => DeleteItem(item.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </div>
                </ListItem>
              ))}
            </List>
          )}
          <Divider />
          <ColorButton
            fullWidth
            onClick={() => alert("Finalizar Compra em breve!")}
          >
            Finalizar Compra
          </ColorButton>
        </Box>
      </Drawer>

      {/* Navbar */}
      <div className="toolbar__">
        <div className="navbar">
          <button
            className="navbar-news"
            onClick={() => navigate("/products/lancamentos")}
          >
            Lançamentos
          </button>
          <button
            className="navbar-amigurumis"
            onClick={() => navigate("/products/amigurumis")}
          >
            Amigurumis
          </button>
          <button
            className="navbar-keychains"
            onClick={() => navigate("/products/chaveiros")}
          >
            Chaveiros
          </button>
          <button
            className="navbar-accessories"
            onClick={() => navigate("/products/acessorios")}
          >
            Acessórios
          </button>
          <button
            className="navbar-all"
            onClick={() => navigate("/products/todos")}
          >
            Todos
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
