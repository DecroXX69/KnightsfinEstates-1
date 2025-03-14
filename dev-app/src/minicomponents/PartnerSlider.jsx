import React, { useEffect, useState } from 'react';
import styles from './PartnersSlider.module.css';
import abc from '../assets/abc.webp';
import emaar from '../assets/emaar.webp';
import damac from '../assets/damac.webp';
import meraas from '../assets/meraas.webp';
import danube from '../assets/danube.webp';
import binghatti from '../assets/binghatti.webp';

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

    const section = document.querySelector(`.${styles.partnersSection}`);
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
    <section className={styles.partnersSection}>
      <div className="container">
        <h2 className={`${styles.partnersTitle} text-center mb-5`}>
          Partners With Leading Developers
        </h2>

        <div className={styles.partnersContainer}>
          {/* Row 1 (Right to Left) */}
          <div className={`${styles.partnersSlider} ${isVisible ? styles.slidingRightToLeft : ''}`}>
            {partners.concat(partners).map((partner, index) => (
              <div key={`row1-${index}`} className={styles.partnerLogoContainer}>
                <div className={styles.partnerLogoCircle}>
                  <img src={partner.image} alt={partner.name} className={styles.partnerLogo} />
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
