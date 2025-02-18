import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Home.css';
import logo1 from '../assets/logo.png';

const Navbar = ({}) => {
  const [isExploreOpen, setIsExploreOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="container d-flex justify-content-between align-items-center">
        <img src={logo1} alt="Logo" className="logo" />

        <div className="d-flex gap-4 align-items-center">
          <Link to="/" className="nav-link">Buy</Link>
          <Link to="/" className="nav-link">Off Plan</Link>
          <Link to="/aboutus" className="nav-link">About Us</Link>
          <div className="dropdown">
            <button className="btn nav-link" onClick={() => setIsExploreOpen(!isExploreOpen)}>
              Explore More <ChevronDown className="icon" />
            </button>
            {isExploreOpen && (
              <div className="dropdown-menu">
                {['Area Guide', 'Services', 'Events', 'Blogs', 'News'].map(item => (
                  <a key={item} href="#" className="dropdown-item">{item}</a>
                ))}
              </div>
            )}
          </div>
          <Link to="/contactus" className="btn btn-primary">Contact Us</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;