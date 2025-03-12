import React, { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import logo1 from "../assets/logo12.webp";

const locationData = {
  Dubai: { flag: "🇦🇪", initials: "DXB" },
  Thailand: { flag: "🇹🇭", initials: "TH" },
  Bangkok: { flag: "🇹🇭", initials: "BKK" },
  Greece: { flag: "🇬🇷", initials: "GR" },
  Cyprus: { flag: "🇨🇾", initials: "CY" },
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.style.overflow = isMenuOpen ? "visible" : "hidden";
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    document.body.style.overflow = "visible";
  };

  return (
    <nav className={`${styles.navbar} ${isMenuOpen ? styles.menuOpen : ""} ${isScrolled ? styles.scrolled : ""}`}>
      <div className={styles.container}>
      <div className={styles.headerContent}>
  <Link to="/">
    <img src={logo1} alt="Logo" className={styles.logo} />
  </Link>

  {/* Hamburger Button */}
  <button
    className={`${styles.hamburger} ${isMenuOpen ? styles.active : ""}`}
    onClick={toggleMenu}
    aria-label={isMenuOpen ? "Close menu" : "Open menu"}  // Adding aria-label for accessibility
  >
    {isMenuOpen ? <X size={28} color="white" /> : <Menu size={28} color="white" />}
  </button>
</div>


        {/* Navbar Links */}
        <div className={`${styles.navLinks} ${isMenuOpen ? styles.show : ""}`} onClick={(e) => e.stopPropagation()}>
  {/* Domestic Properties */}
  <button
    className={styles.navLink} // Added this class
    onClick={() => {
      closeMenu();
      navigate("/propertylisting?location=Pune"); // Use query parameter
    }}
  >
    Domestic Properties
  </button>

  <div className={`${styles.dropdown} ${styles.navLink}`}>
  <button 
    className={styles.dropdownButton} // Add a specific class for this button
    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
  >
    Overseas Properties <ChevronDown size={16} />
  </button>
  {isDropdownOpen && (
    <div className={styles.dropdownMenu}>
      {Object.keys(locationData).map((location) => (
        <button
          key={location}
          className={styles.dropdownItem}
          onClick={() => {
            closeMenu();
            navigate(`/propertylisting?location=${location}`);
          }}
        >
              <span className={styles.flag}>{locationData[location].flag}</span>
    <span className={styles.initials}>{locationData[location].initials}</span>
    {location}
  </button>
))}
              </div>
            )}
          </div>

          <Link to="/aboutus" className={styles.navLink} onClick={closeMenu}>
            About Us
          </Link>
          <Link to="/mortgage" className={styles.navLink} onClick={closeMenu}>
            Mortgage
          </Link>
          <Link to="/contactuspage" className={`${styles.btnPrimary} ${styles.navLink}`} onClick={closeMenu}>
            Contact Us
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
