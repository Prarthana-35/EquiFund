import React from 'react';
import { motion } from 'framer-motion';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { FaArrowDown, FaArrowRight, FaChartLine, FaCoins, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { styled } from '@mui/material/styles';
import { Box, Button, Typography } from '@mui/material';
import bg from '../assets/bg.png';
import graduation from '../assets/graduation.jpg';
import w2 from '../assets/w2.jpg';
import woman from '../assets/woman.jpg';
import ButtonBase from '@mui/material/ButtonBase';  // ✅ Correct for MUI
import stockVideo from '../assets/stocks.mp4';
import { Grid, Card, CardActionArea, CardMedia, CardContent } from "@mui/material";
import '../App.css';

// Stock Ticker Data
const stockData = [
  'AAPL: $150.25 ▲ 1.2%',
  'GOOGL: $2800.50 ▼ 0.8%',
  'TSLA: $750.00 ▲ 3.5%',
  'AMZN: $3400.75 ▲ 2.1%',
  'MSFT: $299.90 ▼ 0.5%',
];

// Image Data
const images = [
  { url: graduation, title: 'Women in STEM', width: '30%', height: '40%' },
  { url: w2, title: 'Financial workshops', width: '30%' },
  { url: woman, title: 'Investments', width: '30%' },
];

// Styled Components
const ImageButton = styled(ButtonBase)(({ theme }) => ({
  position: 'relative',
  height: 200,
  [theme.breakpoints.down('sm')]: {
    width: '100% !important',
    height: 100,
  },
  '&:hover, &.Mui-focusVisible': {
    zIndex: 1,
    '& .MuiImageBackdrop-root': {
      opacity: 0.15,
    },
    '& .MuiImageMarked-root': {
      opacity: 0,
    },
    '& .MuiTypography-root': {
      border: '4px solid currentColor',
    },
  },
}));

const ImageSrc = styled('span')({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundSize: 'cover',
  backgroundPosition: 'center 40%',
});

const Image = styled('span')(({ theme }) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.common.white,
}));

const ImageBackdrop = styled('span')(({ theme }) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundColor: theme.palette.common.black,
  opacity: 0.4,
  transition: theme.transitions.create('opacity'),
}));

const ImageMarked = styled('span')(({ theme }) => ({
  height: 3,
  width: 18,
  backgroundColor: theme.palette.common.white,
  position: 'absolute',
  bottom: -2,
  left: 'calc(50% - 9px)',
  transition: theme.transitions.create('opacity'),
}));

// Home Component
const Home = () => {
  const particlesInit = async (engine) => {
    console.log('Particles engine loaded', engine);
    await loadFull(engine);
  };

  const handleScroll = () => {
    document.getElementById('sign-up').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <div className="text-center w-full overflow-y-scroll">
        {/* Background Image Section */}
        <div className="w-full h-full relative">
          <img src={bg} alt="Background" className="w-full h-full object-cover" />
        </div>

        <section className="py-16 bg-gray-50">
      <div className="section-container mx-auto px-4">
        {/* Section Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center mb-8 text-gray-800"
        >
          Empowering Women Through Financial Knowledge
        </motion.h2>

        {/* Section Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center text-gray-600"
        >
          <p className="mb-6">
           Through <span className="font-bold text-blue-600">WOMEN EMPOWERMENT</span>, we believe that financial independence is the key to a secure future. Our goal is to provide women with the tools, resources, and guidance needed to manage money confidently, invest wisely, and achieve financial freedom.
          </p>
          <p className="mb-6">
            What We Offer:
          </p>
          <ul className="text-left list-disc list-inside mb-6">
            <li className="mb-2">
              <span className="font-semibold">Budgeting Strategies</span> – Learn how to track expenses and build smart spending habits.
            </li>
            <li className="mb-2">
              <span className="font-semibold">Investment Guidance</span> – Understand how to grow your wealth through smart investments.
            </li>
            <li className="mb-2">
              <span className="font-semibold">Financial Education</span> – Access easy-to-understand courses on saving, investing, and more.
            </li>
            <li className="mb-2">
              <span className="font-semibold">Supportive Community</span> – Connect with like-minded women on their financial journey.
            </li>
          </ul>
          <p className="text-lg font-semibold text-blue-600">
            💡 Start your journey to financial empowerment today!
          </p>
        </motion.div>
      </div>
        </section>

           {/* Image Grid Section */}
           <Box sx={{ width: "100%", mt: 4, px: 3, bgcolor: "#1c1c1c", py: 5 }}>
      <Grid container spacing={4} justifyContent="center">
        {images.map((image, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                borderRadius: 4,
                overflow: "hidden",
                width: 350,
                height: 350,
                bgcolor: "#242424", // Dark background
                transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                "&:hover": { 
                  transform: "scale(1.05)",
                  boxShadow: "0px 8px 20px rgba(163, 135, 135, 0.6)",
                },
                boxShadow: "0px 5px 15px rgba(198, 180, 180, 0.5)",
              }}
            >
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="280"
                  image={image.url}
                  alt={image.title}
                  sx={{
                    objectFit: "cover",
                    filter: "brightness(80%)",
                    transition: "filter 0.3s ease-in-out",
                    "&:hover": { filter: "brightness(100%)" },
                  }}
                />
                <CardContent
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    background: "rgba(0, 0, 0, 0.8)", // Darker overlay
                    color: "white",
                    textAlign: "center",
                    py: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: "bold", textShadow: "2px 2px 6px rgba(0,0,0,0.6)" }}>
                    {image.title}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>

        {/* Hero Section with Stock Ticker */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #1e3c72, #2a5298)',
            overflow: 'hidden',
          }}
        >
          {/* Stock Ticker */}
          <div
            className="ticker-container"
            style={{
              position: 'absolute',
              top: 0,
              width: '100%',
              background: 'rgba(0,0,0,0.6)',
              color: 'white',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              padding: '10px 0',
            }}
          >
            <div
              className="ticker"
              style={{
                display: 'inline-block',
                animation: 'tickerAnimation 15s linear infinite',
              }}
            >
              {stockData.map((stock, index) => (
                <span
                  key={index}
                  className="ticker-item"
                  style={{
                    marginRight: '40px',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                  }}
                >
                  {stock}
                </span>
              ))}
            </div>
          </div>
          <div className="hero-container">
      {/* Video Background */}
      <div className="video-background">
      <video autoPlay loop muted className="video">
          <source src={stockVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="overlay"></div> {/* Dark overlay for better text visibility */}
      </div>

      {/* Hero Content */}
      <motion.div
        className="hero-content"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: '2rem', md: '3rem' },
            fontWeight: 'bold',
            color: 'white',
            textAlign: 'center',
            mb: 4,
          }}
        >
          Making a Difference
        </Typography>
        <Typography
          variant="h5"
          sx={{
            fontSize: { xs: '1rem', md: '1.5rem' },
            color: 'white',
            textAlign: 'center',
            mb: 4,
          }}
        >
We are passionate about empowering women to take control of their financial future. Through our programs and services, we help women reduce financial stress, increase financial literacy, and build long-term wealth and resilience.        </Typography>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          <Button
            variant="contained"
            sx={{
              px: 6,
              py: 2,
              fontSize: '1.2rem',
              fontWeight: 'bold',
              borderRadius: '25px',
              background: 'linear-gradient(45deg, #ff9a9e, #fad0c4)',
              color: 'white',
              boxShadow: '0 4px 15px rgba(255, 154, 158, 0.5)',
              '&:hover': {
                background: 'linear-gradient(45deg, #fad0c4, #ff9a9e)',
              },
            }}
          >
            Join the Community <FaArrowRight style={{ marginLeft: '10px' }} />
          </Button>
        </motion.div>
      </motion.div>
    </div>

          {/* Ticker Animation Keyframes */}
          <style>
            {`
              @keyframes tickerAnimation {
                from { transform: translateX(100%); }
                to { transform: translateX(-100%); }
              }
            `}
          </style>
        </Box>

     
        {/* Footer Section */}
        <footer className="footer">
          <div className="footer-container">
            <div className="footer-section">
              <h3>About Us</h3>
              <p>EmpowHER is dedicated to empowering women through financial literacy, education, and tools for success.</p>
            </div>
            <div className="footer-section">
              <h3>Contact Us</h3>
              <p>Email: support@empowher.com</p>
              <p>Phone: +1 (123) 456-7890</p>
              <p>Address: 123 EmpowHER St, City, Country</p>
            </div>
            <div className="footer-section">
              <h3>Follow Us</h3>
              <div className="social-icons align-items justify-center">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} EmpowHER. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Home;