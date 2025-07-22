import { Container, Grid2 as Grid } from "@mui/material";
import { Link, Outlet } from "react-router-dom";
import Sidebar from "./sidebar";
import Header from "./header";

const AppLayout = () => {
  return (
    <>
      <Container maxWidth="lg" className="layout">
        <header className="header">
          <Header />
        </header>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4} className="sidebar">
            {/* <h2>Sidebar</h2> */}
            <Sidebar />
          </Grid>
          <Grid item xs={12} md={8} className="main">
            {/* <h2>Main Content</h2> */}
            <Outlet />
          </Grid>
        </Grid>
        <footer className="footer">
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <h2>Footer</h2>
            </Grid>
          </Grid>
        </footer>
      </Container>
    </>
  );
};

export default AppLayout;
// Compare this snippet from frontend/app/pages/Home.jsx:
// import React from "react";
//
