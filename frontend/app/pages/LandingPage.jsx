import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  Paper,
  Typography,
  useTheme,
  ThemeProvider,
  createTheme,
  Avatar,
  Divider,
  IconButton,
  Chip,
} from "@mui/material";
import {
  Videocam as VideocamIcon,
  Chat as ChatIcon,
  Public as PublicIcon,
  Security as SecurityIcon,
  ArrowForward as ArrowForwardIcon,
  Facebook,
  Twitter,
  Instagram,
  People as PeopleIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

// Create a dark theme
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#00bcd4",
    },
    secondary: {
      main: "#ff4081",
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: "3.5rem",
    },
    h4: {
      fontWeight: 600,
    },
  },
});

const LandingPage = () => {
  const theme = useTheme();
  const [onlineUsers, setOnlineUsers] = useState(0);

  // Simulate live user count
  useEffect(() => {
    // In a real app, you would fetch this from your backend
    const initialCount = Math.floor(Math.random() * 5000) + 1000;
    setOnlineUsers(initialCount);

    const interval = setInterval(() => {
      setOnlineUsers((prev) => {
        const change = Math.floor(Math.random() * 10) - 3;
        return Math.max(1000, prev + change); // Ensure never goes below 1000
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        {/* Header */}
        <AppBar
          position="static"
          elevation={0}
          sx={{
            bgcolor: "background.paper",
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Container maxWidth="lg">
            <Toolbar
              disableGutters
              sx={{ justifyContent: "space-between", py: 1 }}
            >
              {/* Left Side - Logo */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: theme.palette.primary.main,
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                  }}
                >
                  SC
                </Avatar>
                <Typography
                  variant="h6"
                  noWrap
                  component="div"
                  sx={{
                    fontWeight: 700,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  StrangerConnect
                </Typography>
              </Box>

              {/* Right Side - Online Users */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Chip
                  icon={<PeopleIcon fontSize="small" />}
                  label={
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {onlineUsers.toLocaleString()} online now
                    </Typography>
                  }
                  sx={{
                    bgcolor: theme.palette.primary.dark,
                    color: "white",
                    px: 1,
                    "& .MuiChip-icon": { color: "white" },
                  }}
                />
                {/* <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  sx={{
                    borderRadius: 2,
                    px: 3,
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  Join Now
                </Button> */}
              </Box>
            </Toolbar>
          </Container>
        </AppBar>

        {/* Hero Section */}
        <Box
          sx={{
            pt: 8,
            pb: 6,
            background:
              "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
            color: "white",
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography
                  component="h1"
                  variant="h1"
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    lineHeight: 1.2,
                    mb: 3,
                  }}
                >
                  Connect with Strangers{" "}
                  <span style={{ color: theme.palette.primary.main }}>
                    Globally
                  </span>
                </Typography>
                <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
                  Meet new people through video and text chat. No registration
                  required.
                </Typography>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Link to="/connection">
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      endIcon={<ArrowForwardIcon />}
                      sx={{
                        px: 4,
                        py: 1.5,
                        borderRadius: 2,
                        fontSize: "1.1rem",
                        textTransform: "none",
                        fontWeight: 600,
                      }}
                    >
                      Start Chatting
                    </Button>
                  </Link>

                  <Button
                    variant="outlined"
                    color="secondary"
                    size="large"
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      fontSize: "1.1rem",
                      textTransform: "none",
                      fontWeight: 600,
                    }}
                  >
                    How It Works
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper
                  elevation={6}
                  sx={{
                    p: 2,
                    borderRadius: 4,
                    bgcolor: "background.paper",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      height: 300,
                      background:
                        "linear-gradient(45deg, #00bcd4 0%, #ff4081 100%)",
                      borderRadius: 3,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                    }}
                  >
                    <Typography variant="h4">Video Chat Preview</Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Features Section */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Typography
            variant="h3"
            align="center"
            sx={{ mb: 6, fontWeight: 700 }}
          >
            Why Choose Our Platform
          </Typography>
          <Grid container spacing={4}>
            {[
              {
                icon: <VideocamIcon fontSize="large" color="primary" />,
                title: "Video Chat",
                description:
                  "High-quality video connections with people around the world.",
              },
              {
                icon: <ChatIcon fontSize="large" color="primary" />,
                title: "Text Chat",
                description:
                  "Prefer typing? Our text chat is fast and reliable.",
              },
              {
                icon: <PublicIcon fontSize="large" color="primary" />,
                title: "Global Reach",
                description:
                  "Connect with people from every corner of the planet.",
              },
              {
                icon: <SecurityIcon fontSize="large" color="primary" />,
                title: "Safe & Secure",
                description:
                  "We prioritize your privacy and security in every chat.",
              },
            ].map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 4,
                    height: "100%",
                    borderRadius: 3,
                    bgcolor: "background.paper",
                    transition: "transform 0.3s",
                    "&:hover": {
                      transform: "translateY(-5px)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: "primary.main",
                        color: "white",
                        width: 60,
                        height: 60,
                        mb: 3,
                      }}
                    >
                      {feature.icon}
                    </Avatar>
                    <Typography
                      variant="h5"
                      gutterBottom
                      sx={{ fontWeight: 600 }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* CTA Section */}
        <Box
          sx={{
            py: 10,
            bgcolor: "background.paper",
            textAlign: "center",
          }}
        >
          <Container maxWidth="md">
            <Typography
              variant="h3"
              gutterBottom
              sx={{ fontWeight: 700, mb: 3 }}
            >
              Ready to Meet New People?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.8 }}>
              Join thousands of users connecting right now
            </Typography>
            <Link to="/connection">
              <Button
                variant="contained"
                color="primary"
                size="large"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  px: 6,
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: "1.1rem",
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Start Chatting Now
              </Button>
            </Link>
          </Container>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            py: 4,
            bgcolor: "background.default",
            borderTop: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Container maxWidth="lg">
            <Grid
              container
              spacing={4}
              justifyContent="space-between"
              alignItems="center"
            >
              <Grid item>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  StrangerConnect
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  © {new Date().getFullYear()} All rights reserved
                </Typography>
              </Grid>
              <Grid item>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <IconButton aria-label="Facebook" color="primary">
                    <Facebook />
                  </IconButton>
                  <IconButton aria-label="Twitter" color="primary">
                    <Twitter />
                  </IconButton>
                  <IconButton aria-label="Instagram" color="primary">
                    <Instagram />
                  </IconButton>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Box
                  sx={{
                    display: "flex",
                    gap: 3,
                    justifyContent: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      cursor: "pointer",
                      "&:hover": { color: "primary.main" },
                    }}
                  >
                    Privacy Policy
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      cursor: "pointer",
                      "&:hover": { color: "primary.main" },
                    }}
                  >
                    Terms of Service
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      cursor: "pointer",
                      "&:hover": { color: "primary.main" },
                    }}
                  >
                    Community Guidelines
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      cursor: "pointer",
                      "&:hover": { color: "primary.main" },
                    }}
                  >
                    Contact Us
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default LandingPage;
