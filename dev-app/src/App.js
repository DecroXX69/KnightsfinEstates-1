import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './App.css';
import FloatingChat from './services/FloatingChat.jsx';
import Navbar from './components/Navbar.jsx';

// Lazy-loaded components
const Home = React.lazy(() => import('./components/Home.jsx'));
const AboutUs = React.lazy(() => import('./components/AboutUs.jsx'));
const PropertyPage = React.lazy(() => import('./components/PropertyPage.jsx'));
const SaleDescription = React.lazy(() => import('./components/SaleDescription.jsx'));
const PropertyListingPage = React.lazy(() => import('./components/PropertyListingPage.jsx'));
const ContactUsPage = React.lazy(() => import('./components/ContactUsPage.jsx'));
const Mortgage = React.lazy(() => import('./components/Mortgage.jsx'));
const PropertyForm = React.lazy(() => import('./components/Form.jsx'));

// Loading spinner component
const Loading = () => (
  <div className="d-flex justify-content-center mt-5">
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

function ScrollToTop() {
  const location = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Navbar />
      <div className="App">
        <Suspense fallback={<Loading />}>
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
        </Suspense>
      </div>
      <FloatingChat />
    </Router>
  );
}

export default App;