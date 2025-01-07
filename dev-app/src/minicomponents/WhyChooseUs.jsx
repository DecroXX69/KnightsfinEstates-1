import React from 'react';
import './WhyChooseUs.css'; // CSS file for styling

// Import images from src/assets
import image1 from '../assets/whyus.jpg';
import image2 from '../assets/whyus2.jpg';
import image3 from '../assets/whyus1.jpg';

const WhyChooseUs = () => {
  return (
    <div className="why-choose-us">
      <h2>
        <span>Why choose us</span><span className="dot">.</span>
      </h2>
      <p className="subtitle1">We always go an Extra Mile for our Clients!</p>
      <div className="content">
        <div className="image-section">
          <div className="circle image1">
            <img src={image1} alt="Why Choose Us 1" />
          </div>
          <div className="circle image2">
            <img src={image2} alt="Why Choose Us 2" />
          </div>
          <div className="circle image3">
            <img src={image3} alt="Why Choose Us 3" />
          </div>
        </div>
        <div className="text-section">
          <p>
            Working round the clock to provide hassle-free personalized consultancy and advice is always the cynosure of our business. Today, we not only help you buy or take a property on rent, but also manage your property and provide consultancy services like no other.
          </p>
          <div className="features">
            <div className="feature">
              <span className="icon">🤝</span>
              <h4>Associated with 25+ Developers</h4>
              <p>
                We take pride in associating with renowned real estate developers in Dubai such as Emaar, Damac, Sobha Realty, Danube, Vincitore, and many others.
              </p>
            </div>
            <div className="feature">
              <span className="icon">🏠</span>
              <h4>Customized Approach</h4>
              <p>
                We are committed to understanding your preferences, budget, and purpose. Whether buying, selling, or renting, we align with your priorities.
              </p>
            </div>
            <div className="feature">
              <span className="icon">🔑</span>
              <h4>Diverse Range of Properties</h4>
              <p>
                You get easy access to an extensive range of properties, making your real estate search more efficient and comprehensive.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
