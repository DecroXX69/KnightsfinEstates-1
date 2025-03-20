import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LuxuryProperty.module.css';

const LuxuryProperty = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const EXCHANGE_RATE = 23.7;

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          sort: 'createdAt=-1',
          Trend: 'Hot',
        });
        const response = await fetch(`https://knightsfinestates-backend-1.onrender.com/api/properties?${params}`);
        if (!response.ok) throw new Error('Failed to fetch properties');
        const data = await response.json();
        setProperties(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching properties:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  useEffect(() => {
    if (properties.length <= 1) return;
    const slideInterval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % properties.length);
    }, 5000);
    return () => clearInterval(slideInterval);
  }, [properties.length]);

  const handleLearnMore = () => {
    if (properties[currentIndex]) {
      navigate(`/sale/${properties[currentIndex]._id}`);
    }
  };

  const handlePrevProperty = (e) => {
    e.stopPropagation();
    if (properties.length > 1) {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? properties.length - 1 : prevIndex - 1
      );
    }
  };

  const handleNextProperty = (e) => {
    e.stopPropagation();
    if (properties.length > 1) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % properties.length);
    }
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;
  if (properties.length === 0) {
    return <div className={styles.noProperties}>No hot properties available at the moment.</div>;
  }

  const property = properties[currentIndex];
  const mainImage = property.image || '/fallback-image.jpg';
  const propertyName = `${property.buildingName || 'Unknown Building'}, ${property.location || 'Unknown Location'}`;
  const developer = property.developer || 'Unknown Developer';
  const price = property.price
    ? `INR ${Math.round(property.price * EXCHANGE_RATE).toLocaleString()}`
    : 'Price unavailable';

  return (
    <div className={styles.luxuryContainer}>
      <div className={styles.luxuryContent}>
        <div className={styles.luxuryImageSection}>
          <img
            src={mainImage}
            alt={propertyName}
            className={styles.mainPropertyImage}
            onError={(e) => (e.target.src = '/fallback-image.jpg')}
          />
          {properties.length > 1 && (
            <>
              <button
                className={`${styles.slideNavButton} ${styles.slideNavPrev}`}
                onClick={handlePrevProperty}
                aria-label="Previous property"
              >
                ❮
              </button>
              <button
                className={`${styles.slideNavButton} ${styles.slideNavNext}`}
                onClick={handleNextProperty}
                aria-label="Next property"
              >
                ❯
              </button>
              <div className={styles.slideDots}>
                {properties.map((_, index) => (
                  <span
                    key={index}
                    className={`${styles.slideDot} ${currentIndex === index ? styles.slideDotActive : ''}`}
                    onClick={() => setCurrentIndex(index)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        <div className={styles.luxuryDetailsSection}>
          <div className={styles.luxuryHeader}>
            <h1 className={styles.luxuryTitle}>Popular Luxury</h1>
            <p className={styles.companyName}>
              Projects by <strong>Knights Fin Estates</strong>
            </p>
          </div>
          <h2 className={styles.propertyName}>{propertyName}</h2>
          <p className={styles.developerName}>by {developer}</p>
          <div className={styles.propertyDetails}>
            <span>{property.bedrooms || 'N/A'} BHK</span>
            <span>{property.area || 'N/A'} sq. ft.</span>
            <span>{property.propertyType || 'N/A'}</span>
            {/* <span className={styles.status}>{property.subStatus || 'Available'}</span> */}
          </div>
          <div className={styles.priceSection}>
            <h3 className={styles.propertyPrice}>{price}</h3>
          </div>
          <div className={styles.learnMoreSection}>
            <button onClick={handleLearnMore} className={styles.learnMoreBtn}>
              Learn More →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LuxuryProperty;