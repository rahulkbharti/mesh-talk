import React from "react";
import { Container, Typography, Box, Paper } from "@mui/material";
import darkPinkLoveTheme from "../utils/theme";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const PrivacyPolicy = () => {
  return (
    <ThemeProvider theme={darkPinkLoveTheme}>
      <CssBaseline />
      <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 8 }}>
        <Container maxWidth="md">
          <Paper sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h2" component="h1" gutterBottom>
              Privacy Policy
            </Typography>
            <Typography variant="body1" paragraph>
              Your privacy is important to us. It is MeshTalk's policy to respect your privacy regarding any information we may collect from you across our website, and other sites we own and operate.
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
              1. Information we collect
            </Typography>
            <Typography variant="body1" paragraph>
              We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
              2. How we use your information
            </Typography>
            <Typography variant="body1" paragraph>
              We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we’ll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification.
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
              3. Security
            </Typography>
            <Typography variant="body1" paragraph>
              The security of your Personal Information is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Information, we cannot guarantee its absolute security.
            </Typography>
            <Typography variant="body1" paragraph sx={{ mt: 4 }}>
              This policy is effective as of 23 November 2025.
            </Typography>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default PrivacyPolicy;
