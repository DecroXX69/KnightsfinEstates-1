import React from 'react';
import './LuxuryProperty.css';

const LuxuryProperty = ({ 
  mainImage, 
  propertyName, 
  developer,
  price,
  galleryImages,
  onLearnMore
}) => {
  return (
    <div className="luxury-container">
      <div className="luxury-content">
        <div className="luxury-image-section">
          <img 
            src={mainImage} 
            alt={propertyName}
            className="main-property-image"
          />
        </div>
        
        <div className="luxury-details-section">
          <div className="luxury-header">
            <h1 className="luxury-title">Luxury</h1>
            <p className="company-name">
              Projects by <strong>KnightsFineEstates</strong>
            </p>
          </div>

          <div className="property-info">
            <h2 className="property-name">{propertyName}</h2>
            <p className="developer-name">by {developer}</p>
          </div>

          <div className="price-section">
            <h3 className="property-price">{price}</h3>
          </div>

          <div className="gallery-section">
            {galleryImages.map((image, index) => (
              <div key={index} className="gallery-image-container">
                <img 
                  src={image} 
                  alt={`Gallery ${index + 1}`}
                  className="gallery-image"
                />
              </div>
            ))}
          </div>

          <div className="learn-more-section">
            <button 
              onClick={onLearnMore}
              className="learn-more-btn"
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