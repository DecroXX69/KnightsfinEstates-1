import React from "react";  // Ensure this line is present
import Info from "./Info.jsx"; // Import the Info component
import hero from "../assets/About-us-hero.jpg"; // Import the hero image
import "./Aboutus.css"; // Import the AboutUs component styles
import Services from './Services.jsx';
import WhyChooseUs from '../minicomponents/WhyChooseUs.jsx';
import ContactUs from "./ContactUs.jsx";
import Footer from "./Footer.jsx";
const AboutUs = () => {
  return (
    <div className="AboutUs">
        {/* Hero Section */}
      <div className="about-us-hero">
        <img 
          src = {hero}  // Adjust the path if needed
          alt="About Us Hero"
          className="hero-image"
        />
        {/* You can add other content inside the hero container if needed */}
      </div>

      <Info />
      
      <WhyChooseUs/>
        <Services />
        <ContactUs />
        <Footer />
    </div>
  );
};

export default AboutUs;
