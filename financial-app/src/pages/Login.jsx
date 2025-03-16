import { useState } from "react";
import { loginUser } from "../../auth.js";
import PropTypes from "prop-types";
import {
  Container,
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  Alert,
  ThemeProvider,
  createTheme,
} from "@mui/material";

// Custom Theme with Dark Background & White Text
const customTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#121212", // Slightly darker than #2D2D2D for contrast
      paper: "#1E1E1E", // Login component background
    },
    text: {
      primary: "#ffffff",
    },
    success: {
      main: "#4CAF50", // Green button color
    },
  },
});

const Login = ({ onLoginSuccess = () => {} }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    error: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setFormData({ ...formData, error: "" });

    try {
      const response = await loginUser(formData.email, formData.password);

      if (response.message === "Login successful") {
        console.log("Login successful:", response.user);
        onLoginSuccess();
      } else {
        setFormData({ ...formData, error: response.message || "Login failed" });
      }
    } catch (err) {
      console.error("Error logging in:", err);
      setFormData({
        ...formData,
        error: err.message || "An error occurred during login",
      });
    }
  };

  return (
    <ThemeProvider theme={customTheme}>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default",
          px: 2,
        }}
      >
        <Container maxWidth="xs">
          <Paper
            elevation={10}
            sx={{
              padding: 4,
              borderRadius: 3,
              textAlign: "center",
              backgroundColor: "background.paper", // #2D2D2D
              color: "text.primary",
              boxShadow: "0px 4px 15px rgba(0,0,0,0.5)", // Soft shadow
            }}
          >
            <Typography variant="h4" fontWeight="bold" color="success.main" gutterBottom>
              Login
            </Typography>

            {formData.error && <Alert severity="error">{formData.error}</Alert>}

            <Box component="form" onSubmit={handleLogin} sx={{ mt: 3 }}>
              <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
                margin="normal"
                InputLabelProps={{ style: { color: "#ffffff" } }}
                sx={{
                  input: { color: "#ffffff" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#ffffff" },
                    "&:hover fieldset": { borderColor: "#4CAF50" },
                  },
                }}
              />

              <TextField
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
                margin="normal"
                InputLabelProps={{ style: { color: "#ffffff" } }}
                sx={{
                  input: { color: "#ffffff" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#ffffff" },
                    "&:hover fieldset": { borderColor: "#4CAF50" },
                  },
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="success"
                sx={{ mt: 3, py: 1.5 }}
              >
                Login
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

// Prop Validation
Login.propTypes = {
  onLoginSuccess: PropTypes.func,
};

export default Login;
