import React from "react";
import Info from "./Info.jsx";
import hero from "../assets/About-us-hero.jpg";
import styles from "./Aboutus.module.css";
import Services from './Services.jsx';
import WhyChooseUs from '../minicomponents/WhyChooseUs.jsx';
import ContactUs from "./ContactUs.jsx";
import Footer from "./Footer.jsx";

const AboutUs = () => {
  return (
    <div className={styles.aboutUs}>
      {/* Hero Section */}
      <div className={styles.aboutUsHero}>
        <img 
          src={hero}
          alt="About Us Hero"
          className={styles.heroImage}
        />
      </div>

      <Info />
      <WhyChooseUs />
      <Services />
      <ContactUs />
      <Footer />
    </div>
  );
};

export default AboutUs;