import React from "react";
import { Container, Typography, Box, Paper } from "@mui/material";
import darkPinkLoveTheme from "../utils/theme";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const CommunityGuidelines = () => {
  return (
    <ThemeProvider theme={darkPinkLoveTheme}>
      <CssBaseline />
      <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 8 }}>
        <Container maxWidth="md">
          <Paper sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h2" component="h1" gutterBottom>
              Community Guidelines
            </Typography>
            <Typography variant="body1" paragraph>
              Welcome to the MeshTalk community! To ensure a safe and positive experience for everyone, we ask that you follow these guidelines.
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
              1. Be Respectful
            </Typography>
            <Typography variant="body1" paragraph>
              Treat everyone with respect. Harassment, bullying, and hate speech are not tolerated. We are all here to connect with others in a positive way.
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
              2. Keep it Clean
            </Typography>
            <Typography variant="body1" paragraph>
              Do not share sexually explicit content, graphic violence, or any other content that is not appropriate for a general audience.
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
              3. Protect Your Privacy
            </Typography>
            <Typography variant="body1" paragraph>
              Do not share personal information that you are not comfortable with others knowing. This includes your full name, address, phone number, and financial information.
            </Typography>
            <Typography variant="body1" paragraph sx={{ mt: 4 }}>
              By using MeshTalk, you agree to these guidelines. Violations may result in a warning or a permanent ban from the platform.
            </Typography>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default CommunityGuidelines;
