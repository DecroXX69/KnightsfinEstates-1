import React, { useState } from 'react';
import { ArrowLeft, MapPin, Phone } from 'lucide-react';
import './SaleDescription.css';
import MiniContact from './miniContactComponent';
import { useParams, useNavigate } from 'react-router-dom';
import image from '../assets/background1.jpg';
import { MapContainer, Marker, TileLayer, Popup } from 'react-leaflet';
import { LatLng } from 'leaflet'; // You might need this depending on how your map coordinates are structured
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS for proper styling
import L from 'leaflet';
import locationIcon from '../assets/locationIcon.png'; 

const customIcon = new L.Icon({
  iconUrl: locationIcon, // Custom icon image path
  iconSize: [32, 32], // Size of the icon (width, height)
  iconAnchor: [16, 32], // Position the anchor point of the icon
  popupAnchor: [0, -32], // Position the popup
});

const SaleDescription = ({ properties }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messageText, setMessageText] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showFullDescription, setShowFullDescription] = useState(false);
  const defaultLocation = { lat: 25.276987, lng: 55.296249 }; // Default to some known location if missing
  // const mapLocation = property.mapLocation || defaultLocation;

  // For demo purposes, let's assume we have a property with the following details
  const property = {
    id: 1,
    title: '2 BR Apartment for Sale in Binghatti Nova, JVC District 12, (JVC), Dubai',
    location: 'Jumeirah Village Circle',
    type: 'Apartment',
    price: 'AED 1,600,000',
    status: 'FOR SALE',
    bedrooms: 2,
    baths: 3,
    area: '989 sqft',
    mainImage: image,
    additionalImages: [
      image,
      image,
      image,
    ],
    description: [
      "If you are looking for 2- BR apartment for sale in , Binghatti Nova, JVC District 12, Jumeirah Village Circle, Dubai, HJ Real Estates having a team of expert real estate agents in Dubai is happy to introduce you with a fully furnished apartment for sale in Binghatti Nova, JVC District 12, Jumeirah Village Circle, Dubai, featuring 2 bedrooms and 3 bathrooms.",
      "If you ever wish to purchase this apartment by Binghatti Developers in JVC District 12, Jumeirah Village Circle , you can give it on rent and can earn average Rent of AED 93,885 annually. It is a Luxurious apartment with freehold ownership."
    ],
    features: [
      'Swimming Pool',
      'Fitness Center',
      '24/7 Security',
      'CCTV Surveillance',
      'Spa and Wellness Center'
    ],
    mapLocation: { lat: 25.276987, lng: 55.296249 } 
  };

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
            <h1 className="property-title">{property.title}</h1>
            <div className="location-badge">
              <MapPin size={16} />
              <span>{property.location}</span>
            </div>
            <div className="property-specs">
              <span className="spec-item"><i className="bi bi-building"></i> Beds: {property.bedrooms}</span>
              <span className="spec-item"><i className="bi bi-droplet"></i> Baths: {property.baths}</span>
              <span className="spec-item"><i className="bi bi-rulers"></i> {property.area}</span>
            </div>
          </div>
          <div className="col-md-4 text-md-end">
            <div className="property-status">{property.status}</div>
            <div className="property-price">{property.price}</div>
          </div>
        </div>
      </div>

      {/* Property Images Gallery */}
      <div className="container mt-4">
        <div className="row property-gallery">
          <div className="col-md-7 main-image-container">
            <img src={property.mainImage} alt={property.title} className="main-property-image" />
          </div>
          <div className="col-md-5">
            <div className="row">
              {property.additionalImages.map((image, index) => (
                <div className="col-md-6 mb-3" key={index}>
                  <img src={image} alt={`${property.title} - view ${index + 1}`} className="additional-property-image" />
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
                    <div className="overview-label">Bedroom(s)</div>
                    <div className="overview-value">{property.bedrooms}</div>
                  </div>
                </div>
                <div className="overview-item">
                  <div className="overview-icon"><i className="bi bi-droplet"></i></div>
                  <div className="overview-details">
                    <div className="overview-label">Bathroom(s)</div>
                    <div className="overview-value">{property.baths}</div>
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
                  <div className="overview-icon"><i className="bi bi-house-door"></i></div>
                  <div className="overview-details">
                    <div className="overview-label">Property Type</div>
                    <div className="overview-value">{property.type}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Property Description */}
            <div className="details-card mb-4">
              <h2>Property description</h2>
              <div className="property-description">
                {property.description.map((paragraph, index) => (
                  <p key={index} className={index >= 1 && !showFullDescription ? 'hidden-description' : ''}>
                    {paragraph}
                  </p>
                ))}
                {property.description.length > 1 && (
                  <button className="show-more-btn" onClick={handleShowMore}>
                    {showFullDescription ? 'Show Less' : 'Show More'}
                  </button>
                )}
              </div>
            </div>

            {/* Property Features */}
            <div className="details-card mb-4">
              <h2>Property features</h2>
              <div className="property-features">
                {property.features.map((feature, index) => (
                  <div className="feature-item" key={index}>
                    <div className="feature-icon">
                      <i className="bi bi-check-circle-fill"></i>
                    </div>
                    <div className="feature-name">{feature}</div>
                  </div>
                ))}
              </div>
            </div>

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
                    attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
                  />
                  <Marker position={[25.276987, 55.296249]} icon={customIcon}>
                    <Popup>
                      {property.title}
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
                        {/* <img src="/path/to/flag-icon.png" alt="UAE flag" width="20" height="15" /> */}
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