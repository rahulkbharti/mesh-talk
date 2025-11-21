import AppRouter from "./Router";
import { Provider } from "react-redux";
import store from "./store/store";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./utils/queryClient";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#9c27b0",
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
  },
  // typography: {
  //   fontFamily: '"Quicksand", "Roboto", "Helvetica", "Arial", sans-serif',
  // },
  shape: {
    borderRadius: 5,
  },
});

const App = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AppRouter />
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
