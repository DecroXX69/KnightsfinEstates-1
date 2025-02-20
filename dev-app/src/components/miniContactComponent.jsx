import React from 'react';
import { Phone } from 'lucide-react';
import styles from './miniContactComponent.module.css'; // Import the CSS module

const MiniContactComponent = () => {
  return (
    <div className={styles.container}>
      <div className={`${styles.flexWrap} ${styles.mdFlexNoWrap} ${styles.itemsCenter} ${styles.justifyBetween}`}>
        
        <div className={`${styles.flex1}`}>
          <h2 className={`${styles.text3xl} ${styles.fontBold} ${styles.textBlue800} ${styles.mb4}`}>
            Your search for dream home and lucrative investment opportunities ends here!
          </h2>
          <p className={`${styles.textGray600} ${styles.mb6}`}>
            Get in touch with our expert team. We're dedicated to helping you through each phase of your real estate journey.
          </p>
          <button className={`${styles.bgOrange500} ${styles.textWhite} ${styles.px6} ${styles.py3} ${styles.roundedLg} ${styles.flex} ${styles.itemsCenter} ${styles.gap2} ${styles.wFull} ${styles.shadowLg} ${styles.hidden} ${styles.mdBlock}`}>
            <Phone size={20} />
            Contact Us
          </button>
        </div>
        <div className={`${styles.flex1} ${styles.mdW50}`}>
          <img 
            src="https://pub-9257b641bd464d548c680b682dec010d.r2.dev/websitePages/hj-real-estates-cta-bg-1.webp" 
            alt="Handshake" 
            className={`${styles.wFull} ${styles.mdW50} ${styles.shadowLg}`}
          />
        </div>
      </div>
    </div>
  );
};

export default MiniContactComponent;


