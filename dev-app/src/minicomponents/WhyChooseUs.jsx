import React from 'react';
import styles from './WhyChooseUs.module.css';
import image1 from '../assets/whyus.webp';
import image2 from '../assets/whyus2.webp';
import image3 from '../assets/whyus1.webp';

const WhyChooseUs = () => {
  return (
    <div className={styles.whyChooseUs}>
      <h2 className={styles.heading}>
        <span>Why choose us</span><span className={styles.dot}>.</span>
      </h2>
      <p className={styles.subtitle}>We always go an Extra Mile for our Clients!</p>
      <div className={styles.content}>
        <div className={styles.imageSection}>
          <div className={`${styles.circle} ${styles.image1}`}>
            <img src={image1} alt="Why Choose Us 1" />
          </div>
          {/* <div className={`${styles.circle} ${styles.image2}`}>
            <img src={image2} alt="Why Choose Us 2" />
          </div>
          <div className={`${styles.circle} ${styles.image3}`}>
            <img src={image3} alt="Why Choose Us 3" />
          </div> */}
        </div>
        <div className={styles.textSection}>
          <p>
            Working round the clock to provide hassle-free personalized consultancy and advice is always the cynosure of our business. Today, we not only help you buy or take a property on rent, but also manage your property and provide consultancy services like no other.
          </p>
          <div className={styles.features}>
            <div className={styles.featureBox}>
              <div className={styles.icon}>🤝</div>
              <h4 className={styles.featureHeading}>Associated with 25+ Developers</h4>
              <p className={styles.featureText}>
                We take pride in associating with renowned real estate developers in Dubai such as Emaar, Damac, Sobha Realty, Danube, Vincitore, and many others.
              </p>
            </div>
            <div className={styles.featureBox}>
              <div className={styles.icon}>📋</div>
              <h4 className={styles.featureHeading}>Customized Approach</h4>
              <p className={styles.featureText}>
                We are committed to understanding your preferences, budget, and purpose. Whether buying, selling, or renting, we align with your priorities.
              </p>
            </div>
            <div className={styles.featureBox}>
              <div className={styles.icon}>🌍</div>
              <h4 className={styles.featureHeading}>Diverse Range of Properties</h4>
              <p className={styles.featureText}>
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
