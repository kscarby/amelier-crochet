import React, { useState } from 'react'
import '../styles/Body.css';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import { MobileStepper } from '@mui/material';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { green } from '@mui/material/colors';
import Img1 from '../assets/carousel/teste.jpg';
import Img2 from '../assets/carousel/img.jpg';


const bannerImg = [
  {id: 1,
   image: {Img1},
  },
  {id: 2,
    image: {Img2},
   },
]

const Carousel = ({newproducts, patterns, prompt, buypage}) => {

  const theme = createTheme({
    palette: {
      primary: green,
      secondary: {
        main: '#33691e',
      },
    },
  });

  const [activeStep, setActiveStep] = React.useState(0);
  const [banner, setBanner] = React.useState(Img1);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setBanner(Img2);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setBanner(Img1);
  };

  return (
    <div className='Banner'>
      <img src= {banner}></img>
      <ThemeProvider theme = {theme}>
        <MobileStepper
        variant="dots"
        steps={2}
        position="static"
        activeStep={activeStep}
        sx={{ margin: 'auto', maxWidth: 200, flexGrow: 1, backgroundColor: 'transparent' }}
        nextButton={
          <Button size="small" onClick={handleNext} disabled={activeStep === 5}>
            {theme.direction === 'rtl' ? (
              <KeyboardArrowLeft />
            ) : (
              <KeyboardArrowRight />
            )}
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            {theme.direction === 'rtl' ? (
              <KeyboardArrowRight />
            ) : (
              <KeyboardArrowLeft />
            )}
          </Button>
        }
      />
      </ThemeProvider>
    </div>
  );
}

export default Carousel