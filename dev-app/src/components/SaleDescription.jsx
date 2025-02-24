import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Phone } from 'lucide-react';
import './SaleDescription.css';
import MiniContact from './miniContactComponent';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, Marker, TileLayer, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import locationIcon from '../assets/locationIcon.png';

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
    return <div className="loading">Loading...</div>;
  }

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleShowMore = () => {
    setShowFullDescription(!showFullDescription);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    // Handle send message logic here
    alert('Message sent successfully!');
    setMessageText('');
    setFullName('');
    setEmail('');
    setPhoneNumber('');
  };

  // Convert price to AED format
  const formattedPrice = `AED ${property.price.toLocaleString()}`;

  return (
    <div className="property-details-container">
      {/* Property Title Section */}
      <div className="container mt-4">
        <button className="btn-back" onClick={handleGoBack}>
          <ArrowLeft size={20} />
          Back to properties
        </button>
        
        <div className="row mt-3">
          <div className="col-md-8">
            <h1 className="property-title">
              {`${property.bedrooms} ${property.propertyType} for Sale in ${property.buildingName}, ${property.location}`}
            </h1>
            <div className="location-badge">
              <MapPin size={16} />
              <span>{property.location}</span>
            </div>
            <div className="property-specs">
              <span className="spec-item"><i className="bi bi-building"></i> Beds: {property.bedrooms}</span>
              <span className="spec-item"><i className="bi bi-rulers"></i> {property.area}</span>
              <span className="spec-item"><i className="bi bi-house-door"></i> {property.propertyType}</span>
            </div>
          </div>
          <div className="col-md-4 text-md-end">
            <div className="property-status">FOR SALE</div>
            <div className="property-price">{formattedPrice}</div>
          </div>
        </div>
      </div>

      {/* Property Images Gallery */}
      <div className="container mt-4">
        <div className="row property-gallery">
          <div className="col-md-7 main-image-container">
            <img src={property.image} alt={property.buildingName} className="main-property-image" />
          </div>
          <div className="col-md-5">
            <div className="row">
              {property.images?.map((image, index) => (
                <div className="col-md-6 mb-3" key={index}>
                  <img src={image} alt={`${property.buildingName} - view ${index + 1}`} className="additional-property-image" />
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
            <div className="details-card mb-4">
              <h2>Overview</h2>
              <div className="overview-grid">
                <div className="overview-item">
                  <div className="overview-icon"><i className="bi bi-building"></i></div>
                  <div className="overview-details">
                    <div className="overview-label">Developer</div>
                    <div className="overview-value">{property.developer}</div>
                  </div>
                </div>
                <div className="overview-item">
                  <div className="overview-icon"><i className="bi bi-house-door"></i></div>
                  <div className="overview-details">
                    <div className="overview-label">Property Type</div>
                    <div className="overview-value">{property.propertyType}</div>
                  </div>
                </div>
                <div className="overview-item">
                  <div className="overview-icon"><i className="bi bi-rulers"></i></div>
                  <div className="overview-details">
                    <div className="overview-label">Area/Size</div>
                    <div className="overview-value">{property.area}</div>
                  </div>
                </div>
                <div className="overview-item">
                  <div className="overview-icon"><i className="bi bi-building"></i></div>
                  <div className="overview-details">
                    <div className="overview-label">Bedroom(s)</div>
                    <div className="overview-value">{property.bedrooms}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Property Description */}
            <div className="details-card mb-4">
              <h2>Property description</h2>
              <div className="property-description">
                <p className={!showFullDescription ? 'truncate' : ''}>
                  {property.description}
                </p>
                {property.description && (
                  <button className="show-more-btn" onClick={handleShowMore}>
                    {showFullDescription ? 'Show Less' : 'Show More'}
                  </button>
                )}
              </div>
            </div>

            {/* Property Features */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="details-card mb-4">
                <h2>Property features</h2>
                <div className="property-features">
                  {property.amenities.map((amenity, index) => (
                    <div className="feature-item" key={index}>
                      <div className="feature-icon">
                        <i className="bi bi-check-circle-fill"></i>
                      </div>
                      <div className="feature-name">{amenity}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Map Location */}
            <div className="details-card mb-4">
              <h2>Map Location</h2>
              <div className="map-container">
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
            <div className="contact-card">
              <h2>Contact Seller</h2>
              <form onSubmit={handleSendMessage}>
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
                  <label htmlFor="email" className="form-label">Email Address <span className="required">*</span></label>
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
                  <label htmlFor="phone" className="form-label">Phone Number <span className="required">*</span></label>
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
                  <label htmlFor="message" className="form-label">Message <span className="required">*</span></label>
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
                <button type="submit" className="btn btn-send-message w-100">
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
    </div>
  );
};

export default SaleDescription;