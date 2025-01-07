import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Home from './components/Home.jsx';
import AboutUs from './components/AboutUs.jsx';
import Services from './components/Services.jsx';
import './App.css';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
    <div className="App">
     <Home />
     {/* <AboutUs/> */}
    </div>
    </BrowserRouter>
  );
}

export default App;
