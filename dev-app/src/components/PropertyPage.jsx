import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, X, Maximize } from 'lucide-react';
import styles from './PropertyPage.module.css';

const Card = ({ children, className }) => {
  return (
    <div className={`${styles.card} ${className}`}>
      {children}
    </div>
  );
};

const PropertyPage = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllOverview, setShowAllOverview] = useState(false);
  const [fullscreenActive, setFullscreenActive] = useState(false);
  const [activeFloorPlan, setActiveFloorPlan] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        // Get the current path to determine if it's an offplan or sale property
        const isOffplan = window.location.pathname.includes('/offplan/');
        const endpoint = isOffplan ? 
          `http://localhost:5000/api/offplan/${id}` : 
          `http://localhost:5000/api/sale/${id}`;
  
        const response = await fetch(endpoint);
        const data = await response.json();
        
        if (!data) {
          console.error('No property data received');
          return;
        }
        
        setProperty(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching property:', error);
        setLoading(false);
      }
    };
  
    if (id) {
      fetchProperty();
    }
  }, [id]);

  // Handle keyboard events for fullscreen gallery
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!fullscreenActive) return;
      
      if (e.key === 'Escape') {
        setFullscreenActive(false);
      } else if (e.key === 'ArrowRight') {
        handleImageNavigation('next');
      } else if (e.key === 'ArrowLeft') {
        handleImageNavigation('prev');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [fullscreenActive]);

  // Prevent scrolling when fullscreen is active
  useEffect(() => {
    if (fullscreenActive) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [fullscreenActive]);

  if (loading || !property) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const handleRegisterInterest = () => {
    alert('Interest Registered');
  };

  const handleImageNavigation = (direction) => {
    if (!property.images || property.images.length === 0) return;
    
    if (direction === 'next') {
      setCurrentImageIndex((prev) =>
        prev === property.images.length - 1 ? 0 : prev + 1
      );
    } else {
      setCurrentImageIndex((prev) =>
        prev === 0 ? property.images.length - 1 : prev - 1
      );
    }
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  const toggleFullscreen = () => {
    setFullscreenActive(!fullscreenActive);
  };

  // For demo purposes, simulate multiple images if none exist
  const propertyImages = property.images && property.images.length > 0 
    ? property.images 
    : [property.image, property.image, property.image, property.image];

  return (
    <div className="min-vh-100 bg-light">
      {/* Hero Section */}
      <div 
        className={styles.heroSection} 
        style={{ backgroundImage: `url(${property.image})` }}
      >
        <div className={styles.overlay}>
          <div className="container h-100 d-flex flex-column justify-content-end pb-5">
            <h1 className="display-4 text-white mb-3">{property.buildingName}</h1>
            <p className="h3 text-white mb-4">by {property.developer}</p>
            <button
              onClick={handleRegisterInterest}
              className={`${styles.btnPrimary} text-white px-4 py-2 rounded-pill fw-semibold`}
            >
              Register your interest
            </button>
          </div>
        </div>
      </div>

      {/* Property Details Section */}
      <div className={`container py-5 ${styles.propertyDetails}`}>
        <div className="row g-4">
          {/* Left Column */}
          <div className="col-lg-8">
            <h2 className={`h2 ${styles.textPrimary} mb-4`}>
              {property.buildingName} at {property.location}
            </h2>
            
            <div className={`${styles.propertyStats} mb-4`}>
              <div className={styles.statItem}>
                <img src="/api/placeholder/24/24" alt="Bedrooms" className={styles.icon} />
                <span>{property.bedrooms} Bedrooms</span>
              </div>
              <div className={styles.statItem}>
                <img src="/api/placeholder/24/24" alt="Area" className={styles.icon} />
                <span>{property.area} Sq. Ft.</span>
              </div>
              {property.bathrooms && (
                <div className={styles.statItem}>
                  <img src="/api/placeholder/24/24" alt="Bathrooms" className={styles.icon} />
                  <span>{property.bathrooms} Bathrooms</span>
                </div>
              )}
            </div>

            {/* Property Images Gallery */}
            <div className={styles.galleryContainer}>
              <div className={styles.mainImageContainer}>
                <img 
                  src={propertyImages[currentImageIndex] || property.image} 
                  alt={`${property.buildingName} - View ${currentImageIndex + 1}`}
                  className={styles.mainImage}
                  onClick={toggleFullscreen}
                />
                <div className={styles.imageCount}>
                  {currentImageIndex + 1} / {propertyImages.length}
                </div>
                <div className={styles.galleryNavigation}>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleImageNavigation('prev');
                    }}
                    className={styles.navButton}
                    aria-label="Previous image"
                  >
                    <ChevronLeft />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleImageNavigation('next');
                    }}
                    className={styles.navButton}
                    aria-label="Next image"
                  >
                    <ChevronRight />
                  </button>
                </div>
              </div>
              
              <div className={styles.thumbnailsContainer}>
                {propertyImages.slice(0, 3).map((image, index) => (
                  <div 
                    key={index}
                    className={`${styles.thumbnailItem} ${currentImageIndex === index ? styles.active : ''}`}
                    onClick={() => handleThumbnailClick(index)}
                  >
                    <img 
                      src={image} 
                      alt={`${property.buildingName} - Thumbnail ${index + 1}`}
                      className={styles.thumbnailImage}
                    />
                  </div>
                ))}
                {propertyImages.length > 3 && (
                  <div 
                    className={styles.moreImages}
                    onClick={toggleFullscreen}
                  >
                    <Maximize size={20} className="me-2" />
                    +{propertyImages.length - 3} more
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="col-lg-4">
            <div className={styles.priceCard}>
              <div className="mb-4">
                <p className="text-muted mb-1">STARTING PRICE</p>
                <p className={`${styles.priceValue} fw-bold`}>
                  AED {property.price?.toLocaleString()}
                </p>
              </div>
              <div className={styles.priceSeparator}></div>
              <div className="mb-4">
                <p className="text-muted mb-1">BOOKING AMOUNT</p>
                <p className="h3 fw-bold">10%</p>
              </div>
              <div className={styles.priceSeparator}></div>
              <div className="mb-4">
                <p className="text-muted mb-1">HANDOVER</p>
                <p className="h3 fw-bold">2028</p>
              </div>
              <div className={styles.commissionBadge}>
                <p className="h5 mb-1">Direct Sale</p>
                <p className="h2 fw-bold mb-0">0% COMMISSION</p>
              </div>
              <button
                onClick={handleRegisterInterest}
                className={`${styles.btnPrimary} w-100 mt-4 text-white`}
              >
                Register Interest
              </button>
            </div>
          </div>
        </div>

        {/* Overview Section */}
        <div className={styles.overviewSection}>
          <h2 className={`h2 ${styles.textPrimary} mb-4`}>OVERVIEW</h2>
          <div className="row g-4">
            <div className="col-lg-8">
              <div className={styles.overviewText}>
                <p>
                  {property.description}
                </p>
                {property.description && property.description.length > 300 && (
                  <button 
                    onClick={() => setShowAllOverview(!showAllOverview)}
                    className={`btn ${styles.textWarning} px-0`}
                  >
                    {showAllOverview ? 'Show Less' : 'Show More'}
                  </button>
                )}
              </div>
            </div>
            
            {/* Payment Plan */}
            <div className="col-lg-4">
              <div className={styles.paymentPlanCard}>
                <h3 className="h4 mb-4">PAYMENT PLAN</h3>
                <div className="d-flex flex-column">
                  <div className={styles.paymentPlanItem}>
                    <span>ON BOOKING</span>
                    <span className="fw-bold">10%</span>
                  </div>
                  <div className={styles.paymentPlanItem}>
                    <span>DURING CONSTRUCTION</span>
                    <span className="fw-bold">59%</span>
                  </div>
                  <div className={styles.paymentPlanItem}>
                    <span>ON HANDOVER</span>
                    <span className="fw-bold">1%</span>
                  </div>
                  <div className={styles.paymentPlanItem}>
                    <span>POST HANDOVER</span>
                    <span className="fw-bold">30%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Amenities Section */}
        <div className={styles.amenitiesSection}>
          <h2 className="h2 mb-4">AMENITIES & SERVICES</h2>
          <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3">
            {property.amenities?.map((amenity, index) => (
              <div key={index} className="col">
                <div className={styles.amenityItem}>
                  <img src="/api/placeholder/24/24" alt={amenity} className={styles.icon} />
                  <span>{amenity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Floor Plans Section */}
        <div className={styles.floorPlanSection}>
          <h2 className={`h2 ${styles.textPrimary} mb-4`}>FLOOR PLAN</h2>
          <p className="text-muted mb-4">
            {property.buildingName} brings to you a wide range of floor plans offering studios, 1, 2, 3 and 4-bedroom apartments and penthouses that are no less than a haven of luxury.
          </p>
          <div className="d-flex flex-column gap-3">
            {['Studios', '1 Bedroom', '2 Bedroom', '3 Bedroom', '4 Bedroom'].map((plan) => (
              <button
                key={plan}
                className={`${styles.floorPlanButton} ${activeFloorPlan === plan ? styles.active : ''}`}
                onClick={() => setActiveFloorPlan(plan)}
              >
                <span>{plan}</span>
                <ChevronRight size={20} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Fullscreen Image Gallery Modal */}
      <div className={`${styles.fullscreenOverlay} ${fullscreenActive ? styles.active : ''}`}>
        <button 
          className={styles.closeButton}
          onClick={toggleFullscreen}
          aria-label="Close fullscreen"
        >
          <X />
        </button>
        <img 
          src={propertyImages[currentImageIndex] || property.image} 
          alt={`${property.buildingName} - Fullscreen View`}
          className={styles.fullscreenImage}
        />
        <div className={styles.galleryNavigation}>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleImageNavigation('prev');
            }}
            className={styles.navButton}
            aria-label="Previous image"
          >
            <ChevronLeft />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleImageNavigation('next');
            }}
            className={styles.navButton}
            aria-label="Next image"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyPage;