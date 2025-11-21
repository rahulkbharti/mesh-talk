import { createTheme } from "@mui/material";

// --- Create a Dark Pink Love Theme ---
export const darkPinkLoveTheme = createTheme({
    palette: {
        mode: "dark", // Dark theme
        primary: {
            main: "#E91E63", // Strong Pink
        },
        secondary: {
            main: "#FF80AB", // Lighter Pink
        },
        background: {
            default: "#121212", // Standard Dark Background
            paper: "#1e1e1e", // Softer Dark for Cards
        },
        text: {
            primary: "#ffffff",
            secondary: "#bbbbbb",
        },
    },
    typography: {
        fontFamily: '"Quicksand", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 700,
            fontSize: "3.5rem",
            color: "#ffffff", // White heading for dark theme
        },
        h4: {
            fontWeight: 600,
            color: "#f0f0f0",
        },
    },
});
