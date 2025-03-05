import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Home from './components/Home.jsx';
import AboutUs from './components/AboutUs.jsx';
import PropertyPage from './components/PropertyPage.jsx';
import SaleDescription from './components/SaleDescription.jsx';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PropertyListingPage from './components/PropertyListingPage.jsx';
import LuxuryProperty from './minicomponents/LuxuryProperty.jsx';
import ContactUsPage from './components/ContactUsPage.jsx';
import FloatingChat from './services/FloatingChat.jsx';
import Mortgage from './components/Mortgage.jsx';
import Trusted from './minicomponents/Trusted.jsx';

function App() {
  return (
    <Router>
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
        </Routes>
       <FloatingChat />
      </div>
    </Router>
    // <LuxuryProperty />
  );
}

export default App;
