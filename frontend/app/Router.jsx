import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ConnectionPage from "./pages/ConnectionPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CommunityGuidelines from "./pages/CommunityGuidelines";
import ContactUs from "./pages/ContactUs";

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
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/community-guidelines" element={<CommunityGuidelines />} />
        <Route path="/contact" element={<ContactUs />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;