import React from "react";
import {
  Drawer,
  Box,
  List,
  ListItem,
  IconButton,
  Divider,
  Button,
} from "@mui/material";

const ProfileDrawer = ({
  open,
  onClose,
}) => {

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 320, p: 2 }}>
        <Button
              variant="contained"
              sx={{
                backgroundColor: "#B5C18E",
                width: "100%",
                "&:hover": { backgroundColor: "#9cab7a" },
              }}
              onClick={() => alert("Finalizar compra em breve!")}
            >
              Profile
            </Button>
        <h2>Bem vindo!</h2>
        <Divider />
            <List>
                <ListItem
                > Meus pedidos
                </ListItem>
            </List>

            <Divider sx={{ my: 2 }} />
      </Box>
    </Drawer>
  );
};

export default ProfileDrawer;
