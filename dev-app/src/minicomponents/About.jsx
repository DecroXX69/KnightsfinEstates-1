import React from 'react';
import './AboutSection.css';

const About = () => {
  return (
    <div className="about-container container py-5">
      <div className="row align-items-center" styles="margin-top: 100px;">
        <div className="col-lg-6 mb-4 mb-lg-0">
          <div className="about-content">
            <h2 className="about-title">ABOUT</h2>
            <h1 className="company-title">KNIGHTSFIN ESTATES<span className="golden-dot">.</span></h1>
            <h3 className="tagline">Crafting Luxury Living Experiences</h3>
            
            <p className="about-description">
              KnightsFin Estates is a premier real estate channel partner with extensive 
              expertise in Dubai's luxury property market. We provide comprehensive 
              solutions for your real estate aspirations, offering an exclusive portfolio 
              of premium properties that align with your lifestyle and investment goals.
            </p>

            <button className="learn-more-btn">
              More about us <span className="arrow">↗</span>
            </button>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="image-grid">
            <div className="image-quadrant top-left"></div>
            <div className="image-quadrant top-right"></div>
            <div className="image-quadrant bottom-left"></div>
            <div className="image-quadrant bottom-right"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;