import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ConnectionPage from "./pages/ConnectionPage";

const AppRouter = () => {
  return (
    <Router basename="/mesh-talk">
      {/* <nav>
        <Link to="/">Home</Link> |<Link to="/about">About</Link> |
        <Link to="/contact">Contact</Link> |<Link to="/post">Posts</Link> |
        <Link to="/intrest">Intrest</Link> |
        <Link to="/video-chat">Video Chat</Link> |
        <Link to="/media">Media Test</Link> |
      </nav> */}

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/connection" element={<ConnectionPage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
