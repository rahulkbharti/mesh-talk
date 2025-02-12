import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Posts from "./pages/Posts";
import Interest from "./pages/Intrest";

const AppRouter = () => {
    return (
        <Router>
            <nav>
                <Link to="/">Home</Link> |
                <Link to="/about">About</Link> |
                <Link to="/contact">Contact</Link> |
                <Link to="/post">Posts</Link> |
                <Link to="/intrest">Intrest</Link>
            </nav>

            <Routes>
                <Route path="/" element={<>Home</>} />
                <Route path="/about" element={<>About</>} />
                <Route path="/contact" element={<>Contact</>} />
                {/* // for Testing F */}
                <Route path="/post" element={<Posts />} />
                <Route path="/intrest" element={<Interest />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;
