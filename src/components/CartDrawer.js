import React from "react";
import {
  Drawer,
  Box,
  List,
  ListItem,
  IconButton,
  Divider,
  Tooltip,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const CartDrawer = ({
  cart,
  setCart,
  open,
  onClose,
}) => {
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

  const clearCart = () => {
    const confirm = window.confirm("Deseja esvaziar o carrinho?");
    if (confirm) {
      setCart([]);
    }
  };

  const total = cart.reduce(
    (acc, item) => acc + (item.preco || item.price) * item.quantity,
    0
  );

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 320, p: 2 }}>
        <h2>Meu Carrinho</h2>
        <Divider />

        {cart.length === 0 ? (
          <p style={{ marginTop: 20 }}>Carrinho vazio.</p>
        ) : (
          <>
            <List>
              {cart.map((item) => (
                <ListItem
                  key={item.id}
                  sx={{
                    display: "flex",
                    gap: 2,
                    alignItems: "center",
                    borderBottom: "1px solid #eee",
                    paddingY: 1.5,
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.nome || item.title}
                    style={{
                      width: 80,
                      height: 80,
                      objectFit: "cover",
                      borderRadius: 8,
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <h4 style={{ margin: 0 }}>{item.nome || item.title}</h4>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        marginY: 0.5,
                      }}
                    >
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="btn-qty-minus"
                      >
                        -
                      </button>
                      <span style={{ minWidth: 20, textAlign: "center" }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="btn-qty-plus"
                      >
                        +
                      </button>
                    </Box>
                    <p
                      style={{
                        margin: 0,
                        fontWeight: "bold",
                        color: "#B99470",
                      }}
                    >
                      R$ {(item.preco || item.price) * item.quantity}
                    </p>
                  </Box>
                  <Tooltip title="Remover">
                    <IconButton onClick={() => DeleteItem(item.id)}>
                      <DeleteIcon sx={{ color: "#B99470" }} />
                    </IconButton>
                  </Tooltip>
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 2 }} />

            <p
              style={{
                textAlign: "right",
                fontWeight: "bold",
                fontSize: "18px",
              }}
            >
              Total: R$ {total.toFixed(2)}
            </p>

            <Button
              variant="contained"
              sx={{
                backgroundColor: "#B5C18E",
                width: "100%",
                "&:hover": { backgroundColor: "#9cab7a" },
              }}
              onClick={() => alert("Finalizar compra em breve!")}
            >
              Finalizar Compra
            </Button>

            <Button
              variant="text"
              sx={{ mt: 1, color: "red", width: "100%" }}
              onClick={clearCart}
            >
              Limpar Carrinho
            </Button>
          </>
        )}
      </Box>
    </Drawer>
  );
};

export default CartDrawer;
