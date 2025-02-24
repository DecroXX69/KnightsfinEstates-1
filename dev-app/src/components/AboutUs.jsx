import React from "react";  // Ensure this line is present
import Navbar from "./Navbar.jsx"; // Import the Navbar component
import Info from "./Info.jsx"; // Import the Info component
import hero from "../assets/About-us-hero.jpg"; // Import the hero image
import styles from "../components/Aboutus.module.css";
import Services from './Services.jsx';
import WhyChooseUs from '../minicomponents/WhyChooseUs.jsx';
import ContactUs from "./ContactUs.jsx";
import Footer from "./Footer.jsx";

const AboutUs = () => {
  return (
    <div className={styles.aboutUs}>
      {/* Hero Section with Navbar overlay */}
      <div className={styles.aboutUsHero}>
        <img 
          src={hero}
          alt="About Us Hero"
          className={styles.heroImage}
        />
        <div className={styles.navbarOverlay}>
          <Navbar />
        </div>

        {/* Text Overlay */}
        <div className={styles.textOverlay}>
          <h4>About Us</h4>
        </div>
      </div>

      <Info />
      <WhyChooseUs />
      <Services />
      <div><ContactUs /></div>
      
      <Footer />
    </div>
  );
};

export default AboutUs;
