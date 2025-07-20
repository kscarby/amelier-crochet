import React from 'react';
import {
  Box, Typography, TextField, Button, Divider, Link, Grid
} from '@mui/material';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
  const theme = createTheme({
    palette: {
      sage: { main: '#B5C18E' },
      beige: { main: '#F7DCB9' },
      tamara: { main: '#DEAC80' },
      castain: { main: '#B99470' },
    },
  });

  const SubscribeButton = styled(Button)({
    backgroundColor: '#B5C18E',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#9cab7c',
    },
    fontFamily: 'Zain',
    textTransform: 'none',
  });

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ backgroundColor: '#f5f1ea', color: '#5c4a3d', mt: 5, pt: 6, pb: 3 }}>
        <Box sx={{ maxWidth: '1200px', mx: 'auto', px: { xs: 2, sm: 3 } }}>
          <Grid container spacing={4}>
            {/* Sobre */}
            <Grid item xs={12} sm={6} md={3}>
              <h1 className='h1-title'>
                Amelier Crochet
              </h1>
              <Typography variant="body2" sx={{ lineHeight: 1.7 }}>
                Feito com amor em cada ponto.<br />
                Amigurumis feitos à mão<br />
                para alegrar seu lar.
              </Typography>
            </Grid>

            {/* Links */}
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Links
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Link href="/sobre" underline="hover" color="inherit">Sobre</Link>
                <Link href="/produtos" underline="hover" color="inherit">Produtos</Link>
                <Link href="/contato" underline="hover" color="inherit">Contato</Link>
                <Link href="/termos" underline="hover" color="inherit">Termos de Uso</Link>
                <Link href="/politicas" underline="hover" color="inherit">Políticas de Privacidade</Link>
              </Box>
            </Grid>

            {/* Redes Sociais */}
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Redes Sociais
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Link
                  href="https://wa.me/9981290699"
                  target="_blank"
                  color="inherit"
                  underline="hover"
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  <FaWhatsapp color="#25D366" /> WhatsApp
                </Link>
                <Link
                  href="https://instagram.com/amelier.crochet"
                  target="_blank"
                  color="inherit"
                  underline="hover"
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  <FaInstagram color="#E1306C" /> Instagram
                </Link>
              </Box>
            </Grid>

            {/* Newsletter */}
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Receba Novidades
              </Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.6, mb: 1 }}>
                Cadastre seu e-mail para receber<br />
                novidades e promoções!
              </Typography>
              <Box component="form" sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  variant="outlined"
                  placeholder="Seu e-mail"
                  size="small"
                  fullWidth
                  sx={{ backgroundColor: '#fff', borderRadius: 1 }}
                />
                <SubscribeButton variant="contained">
                  Enviar
                </SubscribeButton>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3, borderColor: '#e0ddd6' }} />

          {/* Rodapé inferior */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2">
              © {new Date().getFullYear()} Amelier Crochet. Todos os direitos reservados. |
              <Link href="/termos" underline="hover" color="inherit" sx={{ mx: 1 }}>
                Termos de Uso
              </Link>|
              <Link href="/politicas" underline="hover" color="inherit" sx={{ ml: 1 }}>
                Política de Privacidade
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Footer;
