import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Phone } from 'lucide-react';
import styles from './SaleDescription.module.css';
import MiniContact from './miniContactComponent';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, Marker, TileLayer, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import locationIcon from '../assets/locationIcon.png';
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
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
    message: ''
  });
  
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/sale/${id}`);
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

  if (loading || !property) {
    return <div className={styles.loading}>Loading...</div>;
  }

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleShowMore = () => {
    setShowFullDescription(!showFullDescription);
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
      const response = await axios.post('http://localhost:5000/api/contactus', completeFormData);
  
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

  // Convert price to AED format
  const formattedPrice = `AED ${property.price.toLocaleString()}`;

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
            </div>
          </div>
          <div className="col-md-4 text-md-end">
            <div className={styles.propertyStatus}>FOR SALE</div>
            <div className={styles.propertyPrice}>{formattedPrice}</div>
          </div>
        </div>
      </div>

      {/* Property Images Gallery */}
      <div className="container mt-4">
        <div className={`row ${styles.propertyGallery}`}>
          <div className="col-md-7 main-image-container">
            <img src={property.image} alt={property.buildingName} className={styles.mainPropertyImage} />
          </div>
          <div className="col-md-5">
            <div className="row">
              {property.images?.map((image, index) => (
                <div className="col-md-6 mb-3" key={index}>
                  <img src={image} alt={`${property.buildingName} - view ${index + 1}`} className={styles.additionalPropertyImage} />
                </div>
              ))}
            </div>
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
                <h2>Property features</h2>
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
                  center={[25.276987, 55.296249]}
                  zoom={13}
                  style={{ height: '400px', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={[25.276987, 55.296249]} icon={customIcon}>
                    <Popup>
                      {property.buildingName}
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
    </div>
  );
};

export default SaleDescription;