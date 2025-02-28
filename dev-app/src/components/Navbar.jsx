import React, { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';
import logo1 from '../assets/logo.png';

const locationData = {
  Dubai: { flag: "\ud83c\udde6\ud83c\uddea", initials: "DXB" },
  Thailand: { flag: "\ud83c\uddf9\ud83c\udded", initials: "TH" },
  Bangkok: { flag: "\ud83c\uddf9\ud83c\udded", initials: "BKK" },
  Greece: { flag: "\ud83c\uddec\ud83c\uddf7", initials: "GR" },
  Cyprus: { flag: "\ud83c\udde8\ud83c\uddfc", initials: "CY" },
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.style.overflow = !isMenuOpen ? 'hidden' : 'visible';
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    document.body.style.overflow = 'visible';
  };

  return (
    <nav className={`${styles.navbar} ${isMenuOpen ? styles.menuOpen : ''}`}>
      <div className={styles.container}>
        <div className={styles.headerContent}>
          <Link to="/">
            <img src={logo1} alt="Logo" className={styles.logo} />
          </Link>
          
          <button 
            className={`${styles.hamburger} ${isMenuOpen ? styles.active : ''}`} 
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} color="white" /> : <Menu size={24} color="white" />}
          </button>
        </div>

        <div className={`${styles.navLinks} ${isMenuOpen ? styles.show : ''}`} onClick={closeMenu}>
          <Link to="/propertylisting" className={styles.navLink} state={{ listingType: 'sale' }}>Buy</Link>
          <Link to="/propertylisting" className={styles.navLink} state={{ listingType: 'offplan' }}>Off Plan</Link>
          <Link to="/aboutus" className={styles.navLink}>About Us</Link>
          <Link to="/mortgage" className={styles.navLink}>Mortgage</Link>
          
          {/* Foreign Properties Dropdown */}
          <div className={styles.dropdown}>
            <button className={styles.navLink} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              Foreign Properties <ChevronDown size={16} />
            </button>
            {isDropdownOpen && (
              <div className={styles.dropdownMenu}>
                {Object.keys(locationData).map(location => (
                  <Link 
                    key={location} 
                    to="/propertylisting" 
                    state={{ listingType: 'foreign', location }} 
                    className={styles.dropdownItem}
                    onClick={closeMenu}
                  >
                    <span className={styles.flag}>{locationData[location].flag}</span>
                    <span className={styles.initials}>{locationData[location].initials}</span>
                    {location}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link to="/contactuspage" className={`${styles.btnPrimary} ${styles.navLink}`} onClick={closeMenu}>Contact Us</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
