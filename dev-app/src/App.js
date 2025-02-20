import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Home from './components/Home.jsx';
import AboutUs from './components/AboutUs.jsx';
import PropertyPage from './components/PropertyPage.jsx';
import PropertyListingPage from './components/PropertyListingPage.jsx';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ContactUsPage from './components/ContactUsPage.jsx';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/contactuspage" element={<ContactUsPage />} />
          <Route path="/property/:id" element={<PropertyPage />} />
        </Routes>
        {/* <PropertyListingPage /> */}
      </div>
    </Router>
  );
}

export default App;
