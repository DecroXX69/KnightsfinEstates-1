import React, { useEffect, useState } from 'react';
import './PartnersSlider.css';
import abc from '../assets/abc.png'
import emaar from '../assets/emaar.png'
import damac from '../assets/damac.jpeg'
import meraas from '../assets/meraas.png'
import danube from '../assets/danube.jpeg'
import binghatti from '../assets/binghatti.jpeg'

const PartnersSlider = () => {
  const [isVisible, setIsVisible] = useState(true);

  const partners = [
    { name: 'ABC Real Estates', image: abc },
    { name: 'Emaar', image: emaar },
    { name: 'Damac', image: damac },
    { name: 'Meraas', image: meraas },
    { name: 'Danube', image: danube },
    { name: 'Binghatti', image: binghatti }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const section = document.querySelector('.partners-section');
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

  return (
    <section className="partners-section py-5">
      <div className="container">
        <h2 className="text-center partners-title mb-5">
          Partners With Leading Developers
        </h2>

        <div className="partners-container">
          <div className={`partners-slider ${isVisible ? 'sliding' : ''}`}>
            {/* First set of logos */}
            {partners.map((partner, index) => (
              <div key={index} className="partner-logo-container">
                <div className="partner-logo-circle">
                  <img 
                    src={partner.image} 
                    alt={partner.name} 
                    className="partner-logo"
                  />
                </div>
              </div>
            ))}
            {/* Duplicate set for infinite scroll effect */}
            {partners.map((partner, index) => (
              <div key={`duplicate-${index}`} className="partner-logo-container">
                <div className="partner-logo-circle">
                  <img 
                    src={partner.image} 
                    alt={partner.name} 
                    className="partner-logo"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSlider;