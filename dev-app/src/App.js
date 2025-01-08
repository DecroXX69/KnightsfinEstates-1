import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Home from './components/Home.jsx';
import PropertyListingPage from './components/PropertyListingPage.jsx';
import './App.css';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
    <div className="App">
     {/* <Home /> */}
     <PropertyListingPage />
    </div>
    </BrowserRouter>
  );
}

export default App;
