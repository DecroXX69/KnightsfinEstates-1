import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Home from './components/Home.jsx';
import AboutUs from './components/AboutUs.jsx';
import PropertyPage from './components/PropertyPage.jsx';
import SaleDescription from './components/SaleDescription.jsx';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import PropertyListingPage from './components/PropertyListingPage.jsx';
import LuxuryProperty from './minicomponents/LuxuryProperty.jsx';
import ContactUsPage from './components/ContactUsPage.jsx';
import FloatingChat from './services/FloatingChat.jsx';
import Mortgage from './components/Mortgage.jsx';
import PropertyForm from './components/Form.jsx';
import Navbar from './components/Navbar.jsx';
import { useEffect } from 'react';

function ScrollToTop() {
  const location = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]); // Runs when the route changes

  return null;
}

function App() {
  return (
    <Router>
      <ScrollToTop /> {/* Ensures scrolling to top on page change */}
      <Navbar />
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/propertylisting" element={<PropertyListingPage />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/mortgage" element={<Mortgage />} />
          <Route path="/contactuspage" element={<ContactUsPage />} />
          <Route path="/offplan/:id" element={<PropertyPage />} />
          <Route path="/property/:id" element={<PropertyPage />} />
          <Route path="/sale/:id" element={<SaleDescription />} />
          <Route path="/form" element={<PropertyForm />} />
        </Routes>
        <FloatingChat />
      </div>
    </Router>
  );
}

export default App;
