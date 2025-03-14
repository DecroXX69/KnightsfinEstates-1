import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './App.css';
import FloatingChat from './services/FloatingChat.jsx';
import Navbar from './components/Navbar.jsx';
import AdminPanel from './components/admin.jsx';
import AuthContext, { AuthProvider } from './components/AuthContext.jsx'; // Import both the default and named export
import Login from './components/login.jsx';

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

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = React.useContext(AuthContext);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
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
              <Route path="/login" element={<Login />} />
              {/* <Route path="/form" element={<Navigate to="/admin" />} /> */}

              <Route
                path="/admin"
                element={
                  <PrivateRoute>
                    <AdminPanel />
                  </PrivateRoute>
                }
              />
            </Routes>
          </Suspense>
        </div>
        <FloatingChat />
      </Router>
      </AuthProvider>
  );
}

export default App;