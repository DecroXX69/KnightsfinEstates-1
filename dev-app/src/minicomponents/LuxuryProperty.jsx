import React from 'react';
import styles from './LuxuryProperty.module.css';

const LuxuryProperty = ({ 
  mainImage, 
  propertyName, 
  developer,
  price,
  galleryImages,
  onLearnMore
}) => {
  return (
    <div className={styles.luxuryContainer}>
      <div className={styles.luxuryContent}>
        <div className={styles.luxuryImageSection}>
          <img 
            src={mainImage} 
            alt={propertyName}
            className={styles.mainPropertyImage}
          />
        </div>
        
        <div className={styles.luxuryDetailsSection}>
          <div className={styles.luxuryHeader}>
            <h1 className={styles.luxuryTitle}>Luxury</h1>
            <p className={styles.companyName}>
              Projects by <strong>KnightsFineEstates</strong>
            </p>
          </div>

          <div className={styles.propertyInfo}>
            <h2 className={styles.propertyName}>{propertyName}</h2>
            <p className={styles.developerName}>by {developer}</p>
          </div>

          <div className={styles.priceSection}>
            <h3 className={styles.propertyPrice}>{price}</h3>
          </div>

          <div className={styles.gallerySection}>
            {galleryImages.map((image, index) => (
              <div key={index} className={styles.galleryImageContainer}>
                <img 
                  src={image} 
                  alt={`Gallery ${index + 1}`}
                  className={styles.galleryImage}
                />
              </div>
            ))}
          </div>

          <div className={styles.learnMoreSection}>
            <button 
              onClick={onLearnMore}
              className={styles.learnMoreBtn}
            >
              Learn More →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LuxuryProperty;