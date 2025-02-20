import React, { useState } from 'react';
import { Menu } from 'lucide-react'; // Only import Menu icon since "Explore More" is removed
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css'; // Importing the CSS module
import logo1 from '../assets/logo.png';

const Navbar = ({}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className={styles.navbar}>
      <div className={`${styles.container} d-flex justify-content-between align-items-center`}>
        <img src={logo1} alt="Logo" className={styles.logo} />

        {/* Hamburger Icon for small screens */}
        <button className={styles.hamburger} onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <Menu className={styles.icon} />
        </button>

        {/* Navbar links */}
        <div className={`${styles.navLinks} ${isMenuOpen ? styles.show : ''}`}>
          <Link to="/" className={styles.navLink}>Buy</Link>
          <Link to="/" className={styles.navLink}>Off Plan</Link>
          <Link to="/aboutus" className={styles.navLink}>About Us</Link>
          <Link to="/contactus" className={`${styles.btnPrimary} ${styles.navLink}`}>
            Contact Us
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
