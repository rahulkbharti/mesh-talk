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
  GlobalStyles,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  TextField,
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
  Favorite as FavoriteIcon,
  Menu as MenuIcon,
  Home as HomeIcon,
  ContactMail as ContactMailIcon,
  Psychology as PsychologyIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import darkPinkLoveTheme from "../utils/theme";
import FloatingHearts from "../components/FloatingHearts";
import { io } from "socket.io-client";

const SOCKET_SERVER = import.meta.env.VITE_BACKEND;


const LandingPage = () => {
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  // const isXs = useMediaQuery('(max-width:600px)');
  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, href: '#hero' },
    { text: 'Features', icon: <PsychologyIcon />, href: '#features' },
    { text: 'Start Chatting', icon: <ChatIcon />, link: '/connection' },
    { text: 'Contact', icon: <ContactMailIcon />, href: '#contact' },
  ];

  // Simulate live user count
  useEffect(() => {
    const socket = io(SOCKET_SERVER, { autoConnect: false });
    socket.connect();
    socket.on("connect", () => {
      console.log("Socket Connected:", socket.id);
    });
    socket.on("onlineUsers", (count) => {
      setOnlineUsers(count?.totalConnected ?? 0);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <ThemeProvider theme={darkPinkLoveTheme}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          html: { scrollBehavior: 'smooth' },
          body: { scrollBehavior: 'smooth' },
          '#hero, #features, #how-it-works, #cta, #contact, #contact-us': {
            scrollMarginTop: '90px'
          }
        }}
      />
      <FloatingHearts />
      <Box
        id="hero"
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          position: "relative",
          zIndex: 1,
          transition: "all 0.5s",
        }}
      >
        {/* Header */}
        <AppBar
          position="sticky"
          color="transparent"
          elevation={0}
          sx={{
            pt: 2,
            px: { xs: 2, md: 4 },
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(0, 0, 0, 0.00)',
          }}
        >
          <Container maxWidth="lg" disableGutters>
            <Toolbar sx={{ p: '0 !important', justifyContent: "space-between" }}>
              {/* Left Side - Logo */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: "primary.main",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                  }}
                >
                  <FavoriteIcon />
                </Avatar>
                <Typography
                  variant="h6"
                  noWrap
                  component="div"
                  sx={{
                    fontWeight: 700,
                    color: "primary.main",
                    display: { sm: 'block' },
                  }}
                >
                  MeshTalk
                </Typography>
              </Box>

              <Box sx={{ flexGrow: 1 }} />

              {/* Center - Nav Links (hidden on mobile) */}
              <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, mr: 2 }}>
                <Button
                  color="inherit"
                  component="a"
                  href="#features"
                  sx={{
                    textTransform: 'none',
                    color: 'primary.main',
                    '&:hover': { bgcolor: 'rgba(233, 30, 99, 0.1)' }
                  }}
                >
                  Features
                </Button>
                <Button
                  color="inherit"
                  component={Link}
                  to="/connection"
                  sx={{
                    textTransform: 'none',
                    color: 'primary.main',
                    '&:hover': { bgcolor: 'rgba(233, 30, 99, 0.1)' }
                  }}
                >
                  Start Chatting
                </Button>
                <Button
                  color="inherit"
                  component="a"
                  href="#contact"
                  sx={{
                    textTransform: 'none',
                    color: 'primary.main',
                    '&:hover': { bgcolor: 'rgba(233, 30, 99, 0.1)' }
                  }}
                >
                  Contact
                </Button>
              </Box>

              {/* Right Side - Online Users & Menu Button */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                {onlineUsers > 0 ? (
                  <Chip
                    icon={<FavoriteIcon fontSize="small" sx={{ color: "primary.main" }} />}
                    label={
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {onlineUsers.toLocaleString()} online
                      </Typography>
                    }
                    sx={{
                      bgcolor: "rgba(233, 30, 99, 0.1)",
                      color: "primary.main",
                      border: "1px solid",
                      borderColor: "primary.main",
                      px: 1,
                      display: { sm: 'flex' },
                    }}
                  />
                ) : (
                  <Chip label="Connecting..." sx={{
                    bgcolor: "rgba(233, 30, 99, 0.1)",
                    color: "primary.main",
                    border: "1px solid",
                    borderColor: "primary.main",
                    px: 1,
                    display: { sm: 'flex' },
                  }} />
                )}

                {/* Mobile Menu Icon */}
                <IconButton
                  aria-label="menu"
                  color="primary"
                  onClick={toggleDrawer(true)}
                  sx={{
                    display: { xs: 'flex', md: 'none' },
                    '&:hover': { bgcolor: 'rgba(233, 30, 99, 0.1)' }
                  }}
                >
                  <MenuIcon />
                </IconButton>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>

        {/* Side Drawer for Mobile */}
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={toggleDrawer(false)}
          PaperProps={{
            sx: {
              width: 280,
              bgcolor: 'background.paper',
              backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))',
            }
          }}
        >
          <Box
            sx={{ width: 280 }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
          >
            {/* Drawer Header */}
            <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    sx={{
                      width: 48,
                      height: 48,
                      bgcolor: 'primary.main',
                      color: 'white',
                    }}
                  >
                    {/* <FavoriteIcon /> */}
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    MeshTalk
                  </Typography>
                </Box>
                <IconButton
                  onClick={toggleDrawer(false)}
                  sx={{
                    color: 'primary.main',
                    '&:hover': { bgcolor: 'rgba(233, 30, 99, 0.1)' },
                  }}
                  aria-label="close drawer"
                >
                  <CloseIcon />
                </IconButton>
              </Box>
              <Chip
                icon={<FavoriteIcon fontSize="small" />}
                label={`${onlineUsers.toLocaleString()} online`}
                size="small"
                sx={{
                  bgcolor: 'rgba(233, 30, 99, 0.1)',
                  color: 'primary.main',
                  border: '1px solid',
                  borderColor: 'primary.main',
                }}
              />
            </Box>

            {/* Menu Items */}
            <List>
              {menuItems.map((item, index) => (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton
                    component={item.link ? Link : 'a'}
                    to={item.link}
                    href={item.href}
                    sx={{
                      py: 2,
                      '&:hover': {
                        bgcolor: 'rgba(233, 30, 99, 0.1)',
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: 'primary.main', minWidth: 48 }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontWeight: 500,
                        fontSize: '1rem',
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 2 }} />

            {/* Social Links in Drawer */}
            <Box sx={{ px: 3, pb: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Follow Us
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <IconButton
                  color="primary"
                  aria-label="Facebook"
                  href="https://facebook.com"
                  target="_blank"
                  sx={{ '&:hover': { bgcolor: 'rgba(233, 30, 99, 0.1)' } }}
                >
                  <Facebook />
                </IconButton>
                <IconButton
                  color="primary"
                  aria-label="Twitter"
                  href="https://twitter.com"
                  target="_blank"
                  sx={{ '&:hover': { bgcolor: 'rgba(233, 30, 99, 0.1)' } }}
                >
                  <Twitter />
                </IconButton>
                <IconButton
                  color="primary"
                  aria-label="Instagram"
                  href="https://instagram.com"
                  target="_blank"
                  sx={{ '&:hover': { bgcolor: 'rgba(233, 30, 99, 0.1)' } }}
                >
                  <Instagram />
                </IconButton>
              </Box>
            </Box>
          </Box>
        </Drawer>

        {/* Hero Section */}
        <Box
          sx={{
            // --- REQUESTED CHANGES ---
            minHeight: "calc(100vh - 100px)", // Full viewport height minus header
            display: "flex",
            alignItems: "center",
            // -------------------------
            pt: { xs: 8, md: 0 }, // Added padding top for mobile, 0 for desktop (since it's centered)
            pb: { xs: 8, md: 0 },
            color: "text.primary",
            position: "relative",

          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={6} alignItems="center">

              {/* LEFT SIDE: TEXT CONTENT */}
              <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'center', md: 'left' } }}>

                {/* New: "Badge" content */}
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 1,
                    bgcolor: "rgba(233, 30, 99, 0.1)",
                    color: "primary.main",
                    px: 2,
                    py: 0.5,
                    borderRadius: 10,
                    mb: 3,
                    fontSize: "0.875rem",
                    fontWeight: 600,
                  }}
                >
                  <span style={{ fontSize: "1.2rem" }}>✨</span> #1 Platform for Meaningful Connections
                </Box>

                <Typography
                  component="h1"
                  variant="h1"
                  gutterBottom
                  sx={{
                    fontWeight: 800,
                    lineHeight: 1.1,
                    mb: 3,
                    fontSize: { xs: '2.5rem', sm: '3.2rem', md: '4rem' },
                    letterSpacing: "-0.02em",
                  }}
                >
                  Connect with Kind{" "}
                  <span
                    style={{
                      color: darkPinkLoveTheme.palette.primary.main,
                      position: "relative",
                      display: "inline-block",
                    }}
                  >
                    Hearts
                    {/* Optional decorative underline SVG could go here */}
                  </span>
                </Typography>

                <Typography
                  variant="h5"
                  sx={{
                    mb: 4,
                    opacity: 0.8,
                    fontSize: { xs: '1.1rem', md: '1.3rem' },
                    lineHeight: 1.6,
                    maxWidth: { md: "90%" },
                  }}
                >
                  Experience a safer way to meet new people. Engage in genuine video and
                  text conversations where kindness comes first. No swiping, just connecting.
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    flexWrap: "wrap",
                    justifyContent: { xs: 'center', md: 'flex-start' },
                    mb: 5, // Added margin bottom to separate from stats
                  }}
                >
                  <Link to="/connection" style={{ textDecoration: 'none' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      endIcon={<ArrowForwardIcon />}
                      sx={{
                        px: 4,
                        py: 1.8,
                        borderRadius: 50,
                        fontSize: "1.1rem",
                        textTransform: "none",
                        fontWeight: 700,
                        boxShadow: "0 8px 25px rgba(233, 30, 99, 0.35)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-3px)",
                          boxShadow: "0 12px 30px rgba(233, 30, 99, 0.5)",
                        },
                        width: { xs: "100%", sm: "auto" },
                      }}
                    >
                      Start Chatting Now
                    </Button>
                  </Link>

                  <Button
                    variant="outlined"
                    color="secondary"
                    size="large"
                    component="a"
                    href="#how-it-works"
                    sx={{
                      px: 4,
                      py: 1.8,
                      borderRadius: 50,
                      fontSize: "1.1rem",
                      textTransform: "none",
                      fontWeight: 600,
                      borderWidth: 2,
                      width: { xs: "100%", sm: "auto" },
                      "&:hover": {
                        borderWidth: 2,
                        bgcolor: "rgba(233, 30, 99, 0.05)",
                      },
                    }}
                  >
                    How It Works
                  </Button>
                </Box>


                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 4,
                    justifyContent: { xs: "center", md: "flex-start" },
                    mb: 2,
                  }}
                >
                  {[
                    { label: "Total Users", value: "12,450+" },
                    { label: "Connections Made", value: "87,300+" },
                    { label: "Avg Call Rating", value: "4.9/5" },
                  ].map((stat) => (
                    <Box
                      key={stat.label}
                      sx={{
                        minWidth: 110,
                        px: 2,
                        py: 1,
                        borderRadius: 3,
                        bgcolor: "rgba(233,30,99,0.06)",
                        border: "1px solid",
                        borderColor: "primary.main",
                        textAlign: "center",
                      }}
                    >
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          color: "primary.main",
                          lineHeight: 1.1,
                        }}
                      >
                        {stat.value}
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 500, opacity: 0.8 }}>
                        {stat.label}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Grid>

              {/* RIGHT SIDE: IMAGE */}
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    height: { xs: 300, md: 500 },
                    width: "100%",
                    backgroundImage: "url('https://media.tenor.com/idwX3P42TuQAAAAi/peachu-gomu.gif')",
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    // Added a subtle drop shadow to the graphic to make it pop
                    filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.15))",
                    animation: "float 6s ease-in-out infinite",
                    "@keyframes float": {
                      "0%, 100%": { transform: "translateY(0)" },
                      "50%": { transform: "translateY(-20px)" },
                    },
                  }}
                />
              </Grid>

            </Grid>
          </Container>
        </Box>

        {/* Features Section */}
        <Container id="features" maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
          <Typography
            variant="h3"
            align="center"
            sx={{ mb: { xs: 4, md: 6 }, fontWeight: 700, color: "primary.main", fontSize: { xs: '2rem', md: '3rem' } }}
          >
            Why You'll Love Our Platform
          </Typography>
          <Grid container spacing={4}>
            {[
              {
                icon: VideocamIcon,
                title: "Video Chat",
                description: "High-quality video calls with people worldwide",
              },
              {
                icon: ChatIcon,
                title: "Text Chat",
                description: "Real-time text messaging during your conversations",
              },
              {
                icon: PublicIcon,
                title: "Global Reach",
                description: "Connect with users from around the globe",
              },
              {
                icon: SecurityIcon,
                title: "Safe & Secure",
                description: "Your privacy and security are our top priority",
              },
            ].map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Paper
                    elevation={3}
                    sx={{
                      p: 4,
                      height: "100%",
                      borderRadius: 3,
                      bgcolor: "background.paper",
                      transition: "transform 0.3s, box-shadow 0.3s",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: "0 8px 20px rgba(233, 30, 99, 0.2)",
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
                          bgcolor: "secondary.main",
                          width: 70,
                          height: 70,
                          mb: 3,
                        }}
                      >
                        <IconComponent sx={{ fontSize: 40, color: "white" }} />
                      </Avatar>
                      <Typography
                        variant="h5"
                        gutterBottom
                        sx={{ fontWeight: 600, color: "text.primary" }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </Container>

        {/* How It Works Section */}
        <Container id="how-it-works" maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
          <Typography
            variant="h3"
            align="center"
            sx={{ mb: { xs: 4, md: 6 }, fontWeight: 700, color: "primary.main", fontSize: { xs: '2rem', md: '3rem' } }}
          >
            How It Works
          </Typography>
          <Grid container spacing={4}>
            {[
              {
                icon: PsychologyIcon,
                title: "1. Set Your Interests",
                description: "Add your interests so we can find the best match for you.",
              },
              {
                icon: VideocamIcon,
                title: "2. Start a Chat",
                description: "Click the 'Start Chatting' button to get connected with someone new.",
              },
              {
                icon: FavoriteIcon,
                title: "3. Enjoy the Conversation",
                description: "Have a great time getting to know someone with shared interests!",
              },
            ].map((step, index) => {
              const IconComponent = step.icon;
              return (
                <Grid item xs={12} md={4} key={index}>
                  <Paper
                    elevation={3}
                    sx={{
                      p: 4,
                      height: "100%",
                      borderRadius: 3,
                      bgcolor: "background.paper",
                      transition: "transform 0.3s, box-shadow 0.3s",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: "0 8px 20px rgba(233, 30, 99, 0.2)",
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
                          bgcolor: "secondary.main",
                          width: 70,
                          height: 70,
                          mb: 3,
                        }}
                      >
                        <IconComponent sx={{ fontSize: 40, color: "white" }} />
                      </Avatar>
                      <Typography
                        variant="h5"
                        gutterBottom
                        sx={{ fontWeight: 600, color: "text.primary" }}
                      >
                        {step.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {step.description}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </Container>

        {/* CTA Section */}
        <Box
          sx={{
            py: 10,
            bgcolor: "background.paper", // Dark paper
            textAlign: "center",
          }}
        >
          <Container id="cta" maxWidth="md">
            <Typography
              variant="h3"
              gutterBottom
              sx={{ fontWeight: 700, mb: 3, color: "primary.main", fontSize: { xs: '2rem', md: '3rem' } }}
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
                  borderRadius: 50,
                  fontSize: "1.1rem",
                  textTransform: "none",
                  fontWeight: 600,
                  boxShadow: "0 4px 15px rgba(233, 30, 99, 0.4)",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
              >
                Start Chatting Now
              </Button>
            </Link>
          </Container>
        </Box>

        {/* Contact Us Section */}
        <Box
          sx={{
            py: 10,
            // bgcolor: "background.paper", // Dark paper
            textAlign: "center",
          }}
        >
          <Container id="contact-us" maxWidth="md">
            <Typography
              variant="h3"
              gutterBottom
              sx={{ fontWeight: 700, mb: 3, color: "primary.main", fontSize: { xs: '2rem', md: '3rem' } }}
            >
              Contact Us
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.8 }}>
              Have questions or feedback? We'd love to hear from you!
            </Typography>
            <Box component="form" noValidate autoComplete="off" sx={{ mt: 1, textAlign: 'left' }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="name"
                    variant="outlined"
                    required
                    fullWidth
                    id="name"
                    label="Your Name"

                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="message"
                    label="Message"
                    id="message"
                    multiline
                    rows={4}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2, py: 1.5, fontSize: '1.1rem', fontWeight: 600, borderRadius: 50 }}
              >
                Send Message
              </Button>
            </Box>
          </Container>
        </Box>

        {/* Footer */}
        <Box id="contact"
          sx={{
            py: 4,
            bgcolor: "background.default", // Darkest background
            borderTop: `1px solid ${darkPinkLoveTheme.palette.divider}`,
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
                <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main" }}>
                  MeshTalk
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
                  <IconButton component="a" href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" color="primary">
                    <Facebook />
                  </IconButton>
                  <IconButton component="a" href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" color="primary">
                    <Twitter />
                  </IconButton>
                  <IconButton component="a" href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" color="primary">
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
                  <Typography component="a" href="#" target="_blank" rel="noopener noreferrer"
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      cursor: "pointer",
                      textDecoration: 'none',
                      "&:hover": { color: "primary.main" },
                    }}
                  >
                    Privacy Policy
                  </Typography>
                  <Typography component="a" href="#" target="_blank" rel="noopener noreferrer"
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      cursor: "pointer",
                      textDecoration: 'none',
                      "&:hover": { color: "primary.main" },
                    }}
                  >
                    Terms of Service
                  </Typography>
                  <Typography component="a" href="#" target="_blank" rel="noopener noreferrer"
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      cursor: "pointer",
                      textDecoration: 'none',
                      "&:hover": { color: "primary.main" },
                    }}
                  >
                    Community Guidelines
                  </Typography>
                  <Typography component="a" href="#contact"
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      cursor: "pointer",
                      textDecoration: 'none',
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