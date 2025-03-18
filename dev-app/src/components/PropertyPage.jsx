// PropertyPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, X, Maximize, MapPin, Eye } from 'lucide-react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import styles from './PropertyPage.module.css';

const PropertyPage = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fullscreenActive, setFullscreenActive] = useState(false);
  const [activeFloorPlan, setActiveFloorPlan] = useState(null);

  // Custom Leaflet icon (you'll need to provide an actual icon URL or use a default)
  const customIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`https://knightsfinestates-backend-1.onrender.com/api/offplan/${id}`);
        const data = await response.json();
        
        if (!data) throw new Error('No property data received');
        
        setProperty(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching property:', error);
        setLoading(false);
      }
    };
    
    fetchProperty();
  }, [id]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!fullscreenActive) return;
      if (e.key === 'Escape') setFullscreenActive(false);
      if (e.key === 'ArrowRight') handleImageNavigation('next');
      if (e.key === 'ArrowLeft') handleImageNavigation('prev');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fullscreenActive, property?.images]);

  useEffect(() => {
    document.body.style.overflow = fullscreenActive ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [fullscreenActive]);

  if (loading || !property) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
      </div>
    );
  }

  const handleImageNavigation = (direction) => {
    const totalImages = property.images?.length || 1;
    setCurrentImageIndex(prev => 
      direction === 'next' 
        ? (prev + 1) % totalImages 
        : (prev - 1 + totalImages) % totalImages
    );
  };

  const handleThumbnailClick = (index) => setCurrentImageIndex(index);
  const toggleFullscreen = () => setFullscreenActive(!fullscreenActive);

  const propertyImages = property.images?.length > 0 ? property.images : [property.image];
  const formattedDate = new Date(property.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });

  return (
    <div className={styles.luxuryContainer}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div 
          className={styles.heroImage} 
          style={{ backgroundImage: `url(${property.image})` }}
        >
          <div className={styles.heroOverlay}>
            <div className={styles.heroContent}>
              <h1 className={styles.heroTitle}>{property.buildingName}</h1>
              <p className={styles.heroSubtitle}>
                {property.propertyType} by {property.developer}
              </p>
              <p className={styles.heroLocation}>
                <MapPin size={18} />  {property.locality}, {property.location}
              </p>
              <div className={styles.heroMeta}>
                <span>Status: {property.subStatus}</span>
                <span><Eye size={16} /> Views: {property.viewCount}</span>
                <span>Added: {formattedDate}</span>
              </div>
              <button className={styles.heroButton} onClick={() => alert('Interest Registered')}>
                Enquire Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className={styles.mainContent}>
        {/* Gallery */}
        <div className={styles.gallery}>
          <div className={styles.mainImage}>
            <img 
              src={propertyImages[currentImageIndex]} 
              alt={`${property.buildingName} - View ${currentImageIndex + 1}`}
              onClick={toggleFullscreen}
            />
            <div className={styles.imageControls}>
              <button onClick={() => handleImageNavigation('prev')}><ChevronLeft /></button>
              <span>{currentImageIndex + 1} / {propertyImages.length}</span>
              <button onClick={() => handleImageNavigation('next')}><ChevronRight /></button>
            </div>
          </div>
          <div className={styles.thumbnails}>
            {propertyImages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className={currentImageIndex === idx ? styles.activeThumbnail : ''}
                onClick={() => handleThumbnailClick(idx)}
              />
            ))}
          </div>
        </div>

        {/* Property Details */}
        <div className={styles.detailsGrid}>
          <div className={styles.leftColumn}>
            <div className={styles.propertySpecs}>
              <div className={styles.specItem}>
                <span>{property.bedrooms}</span>
                <span>Bedrooms</span>
              </div>
              <div className={styles.specItem}>
                <span>{property.baths || 'N/A'}</span>
                <span>Bathrooms</span>
              </div>
              <div className={styles.specItem}>
                <span>{property.area}</span>
                <span>Sq. Ft.</span>
              </div>
              <div className={styles.specItem}>
                <span>{property.propertyType}</span>
                <span>Type</span>
              </div>
            </div>

            <div className={styles.description}>
              <h2>Property Overview</h2>
              <p>{property.description}</p>
            </div>

            {property.amenities?.length > 0 && (
              <div className={styles.amenities}>
                <h2>Amenities & Features</h2>
                <div className={styles.amenitiesGrid}>
                  {property.amenities.map((amenity, idx) => (
                    <span key={idx} className={styles.amenityItem}>
                      <span className={styles.dot}></span>
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Location Map */}
            <div className={styles.mapSection}>
              <h2>Location</h2>
              <MapContainer
                center={[property.coordinates.lat, property.coordinates.lng]}
                zoom={13}
                className={styles.mapContainer}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                <Marker 
                  position={[property.coordinates.lat, property.coordinates.lng]}
                  icon={customIcon}
                >
                  <div className={styles.mapPopup}>
                    {property.buildingName}, {property.location}
                  </div>
                </Marker>
              </MapContainer>
            </div>
          </div>

          <div className={styles.rightColumn}>
            <div className={styles.priceCard}>
              <h3>AED {property.price.toLocaleString()}</h3>
              <p>Starting Price</p>
              <div className={styles.metaInfo}>
                <span>Status: {property.status}</span>
                <span>Sub-Status: {property.subStatus}</span>
              </div>
              {property.paymentPlan && (
                <div className={styles.paymentPlan}>
                  <h4>Payment Plan</h4>
                  <div className={styles.planItem}>
                    <span>On Booking</span>
                    <span>{property.paymentPlan.onBooking}%</span>
                  </div>
                  <div className={styles.planItem}>
                    <span>During Construction</span>
                    <span>{property.paymentPlan.duringConstruction}%</span>
                  </div>
                  <div className={styles.planItem}>
                    <span>On Handover</span>
                    <span>{property.paymentPlan.onHandover}%</span>
                  </div>
                  <div className={styles.planItem}>
                    <span>Post Handover</span>
                    <span>{property.paymentPlan.postHandover}%</span>
                  </div>
                </div>
              )}
              <button onClick={() => alert('Interest Registered')}>
                Register Interest
              </button>
            </div>
          </div>
        </div>

        {/* Floor Plans */}
        {property.floorPlans?.length > 0 && (
          <div className={styles.floorPlans}>
            <h2>Floor Plans</h2>
            <div className={styles.floorPlanTabs}>
              {property.floorPlans.map((plan, idx) => (
                <button
                  key={idx}
                  className={activeFloorPlan === idx ? styles.activeTab : ''}
                  onClick={() => setActiveFloorPlan(idx)}
                >
                  {plan.type}
                </button>
              ))}
            </div>
            {activeFloorPlan !== null && (
              <img 
                src={property.floorPlans[activeFloorPlan].planImage} 
                alt={`${property.floorPlans[activeFloorPlan].type} Floor Plan`}
              />
            )}
          </div>
        )}
      </section>

      {/* Fullscreen Gallery */}
      {fullscreenActive && (
        <div className={styles.fullscreen}>
          <button className={styles.closeFullscreen} onClick={toggleFullscreen}>
            <X />
          </button>
          <img 
            src={propertyImages[currentImageIndex]} 
            alt={`Fullscreen View ${currentImageIndex + 1}`}
          />
          <div className={styles.fullscreenNav}>
            <button onClick={() => handleImageNavigation('prev')}><ChevronLeft /></button>
            <button onClick={() => handleImageNavigation('next')}><ChevronRight /></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyPage;