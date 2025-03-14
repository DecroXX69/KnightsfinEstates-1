import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Phone } from 'lucide-react';
import { ChevronLeft, ChevronRight, Maximize } from 'lucide-react';
import styles from './SaleDescription.module.css';
import MiniContact from './miniContactComponent';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, Marker, TileLayer, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import locationIcon from '../assets/locationIcon.webp';
import axios from 'axios';
import Footer from './Footer';
import Navbar from './Navbar';

const customIcon = new L.Icon({
  iconUrl: locationIcon,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const SaleDescription = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messageText, setMessageText] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
    message: ''
  });
  
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`https://knightsfinestates-backend-1.onrender.com/api/sale/${id}`);
        const data = await response.json();
        setProperty(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching property:', error);
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleNavigateToListing = () => {
    navigate('/propertylisting');
  };

  const EXCHANGE_RATE = 23.7;

  const handleShowMore = () => {
    setShowFullDescription(!showFullDescription);
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  const handleImageNavigation = (direction) => {
    if (direction === 'prev') {
      setCurrentImageIndex(prev => 
        prev === 0 ? allImages.length - 1 : prev - 1
      );
    } else {
      setCurrentImageIndex(prev => 
        prev === allImages.length - 1 ? 0 : prev + 1
      );
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(prev => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Create a complete form data object with all required fields
    const completeFormData = {
      fullname: fullName,
      email: email,
      phone: phoneNumber,
      message: messageText,
      // Add default values for the required fields in your model
      chooseProperty: 'Apartment', // Default value
      profession: 'Other' // Default value
    };
  
    try {
      const response = await axios.post('https://knightsfinestates-backend-1.onrender.com/api/contactus', completeFormData);
  
      if (response.status === 201) {
        alert('Message sent successfully!');
        // Clear form
        setFullName('');
        setEmail('');
        setPhoneNumber('');
        setMessageText('');
      }
    } catch (error) {
      console.error('Error submitting the form:', error);
      alert('Error submitting the form. Please try again later.');
    }
  };

  if (loading || !property) {
    return <div className={styles.loading}>Loading...</div>;
  }

  // Calculate variables that depend on property after checking it exists
  const formattedPrice = `INR ${(property.price * EXCHANGE_RATE).toLocaleString()}`;
  const allImages = property.images ? [property.image, ...property.images] : [property.image];
  const isSold = property.subStatus === 'sold';
 
  return (
    <div className={styles.propertyDetailsContainer}>
      <Navbar />
      {/* Property Title Section */}
      <div className="container mt-4">
        <button className={styles.btnBack} onClick={handleGoBack}>
          <ArrowLeft size={20} />
          Back to properties
        </button>
        
        <div className="row mt-3">
          <div className="col-md-8">
            <h1 className={styles.propertyTitle}>
              {`${property.bedrooms} ${property.propertyType} for Sale in ${property.buildingName}, ${property.location}`}
            </h1>
            <div className={styles.locationBadge}>
              <MapPin size={16} />
              <span>{property.location}</span>
            </div>
            <div className={styles.propertySpecs}>
              <span className={styles.specItem}><i className="bi bi-building"></i> Beds: {property.bedrooms}</span>
              <span className={styles.specItem}><i className="bi bi-rulers"></i> {property.area}</span>
              <span className={styles.specItem}><i className="bi bi-house-door"></i> {property.propertyType}</span>
              {/* Add locality if available */}
              {property.locality && (
                <span className={styles.specItem}><i className="bi bi-geo-alt"></i> {property.locality}</span>
              )}
            </div>
          </div>
          <div className="col-md-4 text-md-end">
            <div className={`${styles.propertyStatus} ${isSold ? styles.propertySold : ''}`}>
              {isSold ? 'SOLD' : 'FOR SALE'}
            </div>
            <div className={`${styles.propertyPrice} ${isSold ? styles.soldPrice : ''}`}>
              {formattedPrice}
            </div>
          </div>
        </div>
        
        {/* Sold Notice */}
        {isSold && (
          <div className={styles.soldNotice}>
            <p>
              This property is sold. Check other properties <button 
                onClick={handleNavigateToListing} 
                className={styles.inlineLink}
              >
                here
              </button>.
            </p>
          </div>
        )}
      </div>

      {/* Property Images Gallery */}
      <div className="container mt-4">
        <div className={styles.galleryContainer}>
          <div className={styles.mainImageContainer}>
            <img 
              src={allImages[currentImageIndex]} 
              alt={property.buildingName}
              className={styles.mainImage}
              onClick={toggleFullscreen}
            />
            <div className={styles.imageCount}>
              {currentImageIndex + 1} / {property.images?.length + 1 || 1}
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
            {property.images?.map((image, index) => (
              <div 
                key={index}
                className={`${styles.thumbnailItem} ${currentImageIndex === index + 1 ? styles.active : ''}`}
                onClick={() => handleThumbnailClick(index + 1)}
              >
                <img 
                  src={image} 
                  alt={`${property.buildingName} - Thumbnail ${index + 1}`}
                  className={styles.thumbnailImage}
                />
              </div>
            ))}
            {property.images?.length > 3 && (
              <div 
                className={styles.moreImages}
                onClick={toggleFullscreen}
              >
                <Maximize size={20} className="me-2" />
                +{property.images.length - 3} more
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Property Details Container */}
      <div className="container mt-4">
        <div className="row">
          {/* Left Column - Property Details */}
          <div className="col-lg-8">
            {/* Overview Section */}
            <div className={styles.detailsCard}>
              <h2>Overview</h2>
              <div className={styles.overviewGrid}>
                <div className={styles.overviewItem}>
                  <div className={styles.overviewIcon}><i className="bi bi-building"></i></div>
                  <div className={styles.overviewDetails}>
                    <div className={styles.overviewLabel}>Developer</div>
                    <div className={styles.overviewValue}>{property.developer}</div>
                  </div>
                </div>
                <div className={styles.overviewItem}>
                  <div className={styles.overviewIcon}><i className="bi bi-house-door"></i></div>
                  <div className={styles.overviewDetails}>
                    <div className={styles.overviewLabel}>Property Type</div>
                    <div className={styles.overviewValue}>{property.propertyType}</div>
                  </div>
                </div>
                <div className={styles.overviewItem}>
                  <div className={styles.overviewIcon}><i className="bi bi-rulers"></i></div>
                  <div className={styles.overviewDetails}>
                    <div className={styles.overviewLabel}>Area/Size</div>
                    <div className={styles.overviewValue}>{property.area}</div>
                  </div>
                </div>
                <div className={styles.overviewItem}>
                  <div className={styles.overviewIcon}><i className="bi bi-building"></i></div>
                  <div className={styles.overviewDetails}>
                    <div className={styles.overviewLabel}>Bedroom(s)</div>
                    <div className={styles.overviewValue}>{property.bedrooms}</div>
                  </div>
                </div>
                {/* Add Locality to the overview section */}
                <div className={styles.overviewItem}>
                  <div className={styles.overviewIcon}><i className="bi bi-geo-alt"></i></div>
                  <div className={styles.overviewDetails}>
                    <div className={styles.overviewLabel}>Locality</div>
                    <div className={styles.overviewValue}>{property.locality || 'Not specified'}</div>
                  </div>
                </div>
                {/* Add Status to the overview section */}
                <div className={styles.overviewItem}>
                  <div className={styles.overviewIcon}><i className="bi bi-tag"></i></div>
                  <div className={styles.overviewDetails}>
                    <div className={styles.overviewLabel}>Status</div>
                    <div className={styles.overviewValue}>{isSold ? 'Sold' : 'Available'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Property Description */}
            <div className={`${styles.detailsCard} mb-4`}>
              <h2>Property description</h2>
              <div className={styles.propertyDescription}>
                <p className={!showFullDescription ? styles.truncate : ''}>
                  {property.description}
                </p>
                {property.description && (
                  <button className={styles.showMoreBtn} onClick={handleShowMore}>
                    {showFullDescription ? 'Show Less' : 'Show More'}
                  </button>
                )}
              </div>
            </div>

            {/* Property Features */}
            {property.amenities && property.amenities.length > 0 && (
              <div className={`${styles.detailsCard} mb-4`}>
                <h2>Amenities</h2>
                <div className={styles.propertyFeatures}>
                  {property.amenities.map((amenity, index) => (
                    <div className={styles.featureItem} key={index}>
                      <div className={styles.featureIcon}>
                        <i className="bi bi-check-circle-fill"></i>
                      </div>
                      <div className={styles.featureName}>{amenity}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Map Location */}
            <div className={`${styles.detailsCard} mb-4`}>
              <h2>Map Location</h2>
              <div className={styles.mapContainer}>
                <MapContainer
                  // Use property coordinates, fall back to Dubai coordinates if missing
                  center={[
                    property.coordinates?.lat || 25.276987, 
                    property.coordinates?.lng || 55.296249
                  ]}
                  zoom={13}
                  style={{ height: '400px', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker 
                    position={[
                      property.coordinates?.lat || 25.276987, 
                      property.coordinates?.lng || 55.296249
                    ]} 
                    icon={customIcon}
                  >
                    <Popup>
                      {property.buildingName}, {property.location}
                      {property.locality && `, ${property.locality}`}
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Seller */}
          <div className="col-lg-4">
            <div className={styles.contactCard}>
              <h2>Contact Seller</h2>
              {isSold ? (
                <div className={styles.soldContactMessage}>
                  <p>This property is no longer available. Please check our other properties.</p>
                  <button 
                    onClick={handleNavigateToListing} 
                    className={`${styles.btnSendMessage} w-100 mt-3`}
                  >
                    Browse Properties
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="fullName" className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="fullName"
                      placeholder="Your Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email Address <span className={styles.required}>*</span></label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="Your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="phone" className="form-label">Phone Number <span className={styles.required}>*</span></label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <div className="d-flex align-items-center">
                          <span className="ms-1">+91</span>
                        </div>
                      </span>
                      <input
                        type="tel"
                        className="form-control"
                        id="phone"
                        placeholder="Phone number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="message" className="form-label">Message <span className={styles.required}>*</span></label>
                    <textarea
                      className="form-control"
                      id="message"
                      rows="4"
                      placeholder="Your message"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className={`${styles.btnSendMessage} w-100`}>
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mini Contact Component at the bottom */}
      <div className="container mt-5 mb-5">
        <MiniContact />
      </div>
      {/* Footer */}
      <Footer />

      {/* Fullscreen Gallery */}
      {isFullscreen && (
        <div className={`${styles.fullscreenOverlay} ${styles.active}`}>
          <button 
            className={styles.closeButton} 
            onClick={toggleFullscreen}
            aria-label="Close fullscreen gallery"
          >
            &times;
          </button>
          <img 
            src={allImages[currentImageIndex]} 
            alt={`${property.buildingName} - View ${currentImageIndex + 1}`}
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
      )}
    </div>
  );
};

export default SaleDescription;