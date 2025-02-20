import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Home from './components/Home.jsx';
import AboutUs from './components/AboutUs.jsx';
import PropertyPage from './components/PropertyPage.jsx';
import PropertyListingPage from './components/PropertyListingPage.jsx';
import SaleDescription from './components/SaleDescription.jsx';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/propertylisting" element={<PropertyListingPage />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/offplan/:id" element={<PropertyPage />} />
          
        <Route path="/sale/:id" element={<SaleDescription />} />
        </Routes>
        {/* <PropertyListingPage /> */}
      </div>
    </Router>
  );
}

export default App;
