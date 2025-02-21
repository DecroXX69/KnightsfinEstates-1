// Navbar.jsx
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';
import logo1 from '../assets/logo.png';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
            {isMenuOpen ? (
              <X size={24} color="white" />
            ) : (
              <Menu size={24} color="white" />
            )}
          </button>
        </div>

        <div className={`${styles.navLinks} ${isMenuOpen ? styles.show : ''}`}>
          <Link
            to="/propertylisting"
            className={styles.navLink}
            state={{ listingType: 'sale' }}
          >
            Buy
          </Link>
          <Link
            to="/propertylisting"
            className={styles.navLink}
            state={{ listingType: 'offplan' }}
          >
            Off Plan
          </Link>
          <Link to="/aboutus" className={styles.navLink}>About Us</Link>
          <Link to="/contactuspage" className={`${styles.btnPrimary} ${styles.navLink}`}>
            Contact Us
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;