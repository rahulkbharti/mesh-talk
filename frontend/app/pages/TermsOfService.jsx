import React from "react";
import { Container, Typography, Box, Paper } from "@mui/material";
import darkPinkLoveTheme from "../utils/theme";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const TermsOfService = () => {
  return (
    <ThemeProvider theme={darkPinkLoveTheme}>
      <CssBaseline />
      <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 8 }}>
        <Container maxWidth="md">
          <Paper sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h2" component="h1" gutterBottom>
              Terms of Service
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
              1. Terms
            </Typography>
            <Typography variant="body1" paragraph>
              By accessing the website at MeshTalk, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
              2. Use License
            </Typography>
            <Typography variant="body1" paragraph>
              Permission is granted to temporarily download one copy of the materials (information or software) on MeshTalk's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
              3. Disclaimer
            </Typography>
            <Typography variant="body1" paragraph>
              The materials on MeshTalk's website are provided on an 'as is' basis. MeshTalk makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </Typography>
            <Typography variant="body1" paragraph sx={{ mt: 4 }}>
              These terms and conditions are effective as of 23 November 2025.
            </Typography>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default TermsOfService;
