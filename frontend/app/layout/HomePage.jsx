import React from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardMedia,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  TextField,
  InputAdornment,
  IconButton,
  useTheme,
  useMediaQuery,
  Fade,
  Slide,
  Zoom,
  Avatar,
  Chip,
} from "@mui/material";
import {
  Favorite,
  Videocam,
  ArrowForward,
  CheckCircle,
  Security,
  Face,
  FlashOn,
  HeartBroken,
  Chat,
  Send,
  LocationOn,
  Interests,
  Star,
  Facebook,
  Twitter,
  Instagram,
  FavoriteBorder,
} from "@mui/icons-material";

// Romantic color palette
const romanticTheme = {
  palette: {
    primary: {
      main: "#e91e63", // Romantic pink
      light: "#f48fb1",
      dark: "#c2185b",
    },
    secondary: {
      main: "#9c27b0", // Purple
      light: "#ba68c8",
      dark: "#7b1fa2",
    },
    background: {
      default: "#fff5f7", // Very light pink
      paper: "#ffffff",
    },
  },
};

const features = [
  {
    icon: <Face color="primary" />,
    title: "Real Connections",
    description: "See who you're talking to with live video verification",
  },
  {
    icon: <Favorite color="primary" />,
    title: "Instant Chemistry",
    description: "Spark connections through face-to-face conversations",
  },
  {
    icon: <Security color="primary" />,
    title: "Safe Dating",
    description: "Built-in safety features and moderation",
  },
  {
    icon: <FlashOn color="primary" />,
    title: "Quick Matching",
    description: "Find your perfect match in seconds",
  },
  {
    icon: <HeartBroken color="primary" />,
    title: "No Catfishing",
    description: "Real profiles with video verification",
  },
  {
    icon: <Chat color="primary" />,
    title: "Icebreaker Games",
    description: "Fun activities to start your conversation",
  },
];

const successStories = [
  {
    names: "Sarah & Michael",
    story:
      "We connected instantly on our first video chat and have been together for 2 years now!",
    avatar: "SM",
    date: "Matched March 2022",
  },
  {
    names: "Emma & David",
    story:
      "The video call feature helped us build trust before meeting in person.",
    avatar: "ED",
    date: "Matched September 2021",
  },
  {
    names: "Jessica & Alex",
    story: "We knew there was chemistry from our very first video date!",
    avatar: "JA",
    date: "Matched January 2023",
  },
];

const HeroSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
        color: "white",
        py: 10,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Fade in timeout={1000}>
              <Box>
                <Typography
                  variant="h2"
                  component="h1"
                  gutterBottom
                  sx={{ fontWeight: 700 }}
                >
                  Find Love Through Real Connections
                </Typography>
                <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
                  The safest way to meet new people through live video dating
                </Typography>
                <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    startIcon={<Favorite />}
                    sx={{ px: 4, py: 1.5 }}
                  >
                    Start Matching
                  </Button>
                  <Button
                    variant="outlined"
                    color="inherit"
                    size="large"
                    sx={{ px: 4, py: 1.5 }}
                  >
                    How It Works
                  </Button>
                </Box>
                <List dense sx={{ color: "white" }}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36, color: "white" }}>
                      <CheckCircle />
                    </ListItemIcon>
                    <ListItemText primary="100% verified profiles" />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36, color: "white" }}>
                      <CheckCircle />
                    </ListItemIcon>
                    <ListItemText primary="No more catfishing" />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36, color: "white" }}>
                      <CheckCircle />
                    </ListItemIcon>
                    <ListItemText primary="Instant chemistry through video" />
                  </ListItem>
                </List>
              </Box>
            </Fade>
          </Grid>
          {!isMobile && (
            <Grid item xs={12} md={6}>
              <Zoom in timeout={1000}>
                <Paper
                  elevation={10}
                  sx={{
                    borderRadius: 4,
                    overflow: "hidden",
                    position: "relative",
                    aspectRatio: "16/9",
                    background:
                      "linear-gradient(45deg, #121212 0%, #1e1e1e 100%)",
                  }}
                >
                  {/* Mock video call UI */}
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                    }}
                  >
                    <Box sx={{ display: "flex", gap: 4 }}>
                      <Avatar
                        sx={{
                          width: 100,
                          height: 100,
                          fontSize: 48,
                          bgcolor: theme.palette.primary.main,
                        }}
                      >
                        Y
                      </Avatar>
                      <Avatar
                        sx={{
                          width: 100,
                          height: 100,
                          fontSize: 48,
                          bgcolor: theme.palette.secondary.main,
                        }}
                      >
                        P
                      </Avatar>
                    </Box>
                    <Typography variant="h6" sx={{ mt: 4, color: "white" }}>
                      You matched with{" "}
                      <span style={{ color: theme.palette.primary.light }}>
                        Priya!
                      </span>
                    </Typography>
                    <Chip
                      icon={<FavoriteBorder />}
                      label="Start Video Chat"
                      color="primary"
                      sx={{ mt: 2, color: "white" }}
                      clickable
                    />
                  </Box>
                </Paper>
              </Zoom>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

const FeaturesSection = () => {
  const theme = useTheme();

  return (
    <Box sx={{ py: 10, bgcolor: "background.default" }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            sx={{ fontWeight: 700 }}
          >
            Why Video Dating Works Better
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            maxWidth="md"
            mx="auto"
          >
            Discover genuine connections before you meet in person
          </Typography>
        </Box>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Slide direction="up" in timeout={(index + 1) * 200}>
                <Card
                  sx={{
                    height: "100%",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: `0 8px 20px ${theme.palette.primary.light}40`,
                    },
                  }}
                >
                  <CardContent sx={{ textAlign: "center", p: 4 }}>
                    <Box
                      sx={{
                        width: 72,
                        height: 72,
                        borderRadius: "50%",
                        bgcolor: "primary.light",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 3,
                        color: "white",
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="h5" component="h3" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Slide>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

const HowItWorksSection = () => {
  const steps = [
    {
      title: "Create Your Profile",
      description: "Set up your dating profile with photos and interests",
      icon: <Face color="primary" />,
    },
    {
      title: "Find Matches",
      description: "Discover people who share your interests and values",
      icon: <Favorite color="primary" />,
    },
    {
      title: "Start Video Chatting",
      description: "Connect instantly through live video calls",
      icon: <Videocam color="primary" />,
    },
  ];

  return (
    <Box sx={{ py: 10, bgcolor: "background.paper" }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            sx={{ fontWeight: 700 }}
          >
            How It Works
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            maxWidth="md"
            mx="auto"
          >
            Find your perfect match in just three simple steps
          </Typography>
        </Box>
        <Grid container spacing={4} justifyContent="center">
          {steps.map((step, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Fade in timeout={(index + 1) * 300}>
                <Box sx={{ textAlign: "center", px: 4 }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      bgcolor: "primary.light",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 3,
                      color: "white",
                    }}
                  >
                    {step.icon}
                  </Box>
                  <Typography variant="h5" component="h3" gutterBottom>
                    {index + 1}. {step.title}
                  </Typography>
                  <Typography color="text.secondary">
                    {step.description}
                  </Typography>
                </Box>
              </Fade>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

const SuccessStoriesSection = () => {
  return (
    <Box sx={{ py: 10, bgcolor: "background.default" }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            sx={{ fontWeight: 700 }}
          >
            Real Success Stories
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            maxWidth="md"
            mx="auto"
          >
            Couples who found love through our platform
          </Typography>
        </Box>
        <Grid container spacing={4}>
          {successStories.map((story, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Fade in timeout={(index + 1) * 300}>
                <Paper
                  elevation={3}
                  sx={{ p: 4, height: "100%", borderRadius: 3 }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <Avatar
                      sx={{
                        bgcolor: "primary.main",
                        mr: 2,
                        width: 60,
                        height: 60,
                        fontSize: 24,
                      }}
                    >
                      {story.avatar}
                    </Avatar>
                    <Box>
                      <Typography fontWeight="bold" variant="h6">
                        {story.names}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {story.date}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body1" fontStyle="italic" sx={{ mb: 3 }}>
                    "{story.story}"
                  </Typography>
                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} color="primary" />
                    ))}
                  </Box>
                </Paper>
              </Fade>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

const CtaSection = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        py: 10,
        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
        color: "white",
        textAlign: "center",
      }}
    >
      <Container maxWidth="md">
        <Typography
          variant="h3"
          component="h2"
          gutterBottom
          sx={{ fontWeight: 700, mb: 3 }}
        >
          Ready to Find Your Perfect Match?
        </Typography>
        <Typography variant="h5" sx={{ mb: 5, opacity: 0.9 }}>
          Join thousands of singles finding love through real connections
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          startIcon={<Favorite />}
          sx={{
            px: 6,
            py: 2,
            fontSize: "1.1rem",
            fontWeight: 600,
            boxShadow: `0 4px 20px ${theme.palette.secondary.light}`,
          }}
        >
          Start Your Love Story
        </Button>
      </Container>
    </Box>
  );
};

const Footer = () => {
  return (
    <Box sx={{ bgcolor: "background.paper", py: 6 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontWeight: 700, color: "primary.main" }}
            >
              HeartConnect
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Where real connections lead to real relationships
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              {[Facebook, Twitter, Instagram].map((Icon, index) => (
                <IconButton key={index} color="primary">
                  <Icon />
                </IconButton>
              ))}
            </Box>
          </Grid>
          <Grid item xs={6} md={2}>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              Dating
            </Typography>
            <List dense>
              {["Matches", "Search", "Video Dates", "Success Stories"].map(
                (item) => (
                  <ListItem key={item} sx={{ px: 0, py: 0.5 }}>
                    <ListItemText
                      primary={item}
                      primaryTypographyProps={{
                        variant: "body2",
                        sx: { "&:hover": { color: "primary.main" } },
                      }}
                    />
                  </ListItem>
                )
              )}
            </List>
          </Grid>
          <Grid item xs={6} md={2}>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              Safety
            </Typography>
            <List dense>
              {["Guidelines", "Privacy", "Community", "Support"].map((item) => (
                <ListItem key={item} sx={{ px: 0, py: 0.5 }}>
                  <ListItemText
                    primary={item}
                    primaryTypographyProps={{
                      variant: "body2",
                      sx: { "&:hover": { color: "primary.main" } },
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              Find Love Nearby
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Enter your location"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOn color="primary" />
                  </InputAdornment>
                ),
                sx: { bgcolor: "background.default" },
              }}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              size="small"
              fullWidth
              startIcon={<Interests />}
            >
              Match by Interests
            </Button>
          </Grid>
        </Grid>
        <Divider sx={{ my: 4 }} />
        <Typography variant="body2" color="text.secondary" textAlign="center">
          © {new Date().getFullYear()} HeartConnect. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

const HomePage = () => {
  return (
    <Box sx={{ overflowX: "hidden" }}>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <SuccessStoriesSection />
      <CtaSection />
      <Footer />
    </Box>
  );
};

export default HomePage;
