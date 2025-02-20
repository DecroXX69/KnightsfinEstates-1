import React from 'react';
import styles from './AboutSection.module.css';

const About = () => {
  return (
    <div className={`${styles.aboutContainer} container py-5`}>
      <div className="row align-items-center" style={{ marginTop: '100px' }}>
        <div className="col-lg-6 mb-4 mb-lg-0">
          <div className={styles.aboutContent}>
            <h2 className={styles.aboutTitle}>ABOUT</h2>
            <h1 className={styles.companyTitle}>
              KNIGHTSFIN ESTATES<span className={styles.goldenDot}>.</span>
            </h1>
            <h3 className={styles.tagline}>Crafting Luxury Living Experiences</h3>

            <p className={styles.aboutDescription}>
              KnightsFin Estates is a premier real estate channel partner with extensive 
              expertise in Dubai's luxury property market. We provide comprehensive 
              solutions for your real estate aspirations, offering an exclusive portfolio 
              of premium properties that align with your lifestyle and investment goals.
            </p>

            <button className={styles.learnMoreBtn}>
              More about us <span className={styles.arrow}>↗</span>
            </button>
          </div>
        </div>

        <div className="col-lg-6">
          <div className={styles.imageGrid}>
            <div className={styles.topLeft}></div>
            <div className={styles.topRight}></div>
            <div className={styles.bottomLeft}></div>
            <div className={styles.bottomRight}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
