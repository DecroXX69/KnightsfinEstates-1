import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const PropertyPage = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllOverview, setShowAllOverview] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/properties/${id}`);
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
    return <div className="d-flex justify-content-center align-items-center vh-100">Loading...</div>;
  }

  const handleRegisterInterest = () => {
    alert('Interest Registered');
  };

  const handleImageNavigation = (direction) => {
    if (direction === 'next') {
      setCurrentImageIndex((prev) => 
        prev === property.images?.length - 1 ? 0 : prev + 1
      );
    } else {
      setCurrentImageIndex((prev) => 
        prev === 0 ? property.images?.length - 1 : prev - 1
      );
    }
  };

  return (
    <div className="min-vh-100 bg-white">
      {/* Hero Section */}
      <div className="hero-section position-relative">
        <div className="hero-overlay position-absolute">
          <div className="container h-100 d-flex flex-column justify-content-end pb-5">
            <h1 className="display-4 text-white mb-3">{property.buildingName}</h1>
            <p className="h3 text-white mb-4">by {property.developer}</p>
            <button
              onClick={handleRegisterInterest}
              className="btn btn-light btn-lg text-primary rounded-pill px-4 py-2"
            >
              Register your interest
            </button>
          </div>
        </div>
      </div>

      {/* Property Details Section */}
      <div className="container py-5">
        <div className="row g-4">
          {/* Left Column */}
          <div className="col-lg-8">
            <h2 className="h2 text-primary mb-4">
              {property.buildingName} at {property.location}
            </h2>
            
            <div className="d-flex gap-4 mb-4">
              <div className="d-flex align-items-center gap-2">
                <img src="/api/placeholder/24/24" alt="Bedrooms" width="24" height="24" />
                <span>{property.bedrooms}</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <img src="/api/placeholder/24/24" alt="Area" width="24" height="24" />
                <span>{property.area} Sq. Ft.</span>
              </div>
            </div>

            {/* Property Images */}
            <div className="row mb-5">
              <div className="col-md-8 mb-3 mb-md-0">
                <img 
                  src={property.images?.[currentImageIndex] || property.image} 
                  alt="Property"
                  className="img-fluid rounded property-main-image"
                />
              </div>
              <div className="col-md-4">
                <img 
                  src={property.images?.[currentImageIndex] || property.image}
                  alt="Current view"
                  className="img-fluid rounded mb-3 property-thumb-image"
                />
                <div className="d-flex justify-content-between">
                  <button 
                    onClick={() => handleImageNavigation('prev')}
                    className="btn btn-primary rounded-circle"
                  >
                    <i className="bi bi-chevron-left"></i>
                  </button>
                  <button 
                    onClick={() => handleImageNavigation('next')}
                    className="btn btn-primary rounded-circle"
                  >
                    <i className="bi bi-chevron-right"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="col-lg-4">
            <div className="card shadow-lg">
              <div className="card-body">
                <div className="mb-4">
                  <p className="text-muted mb-1">STARTING PRICE</p>
                  <p className="h3 text-warning">
                    AED {property.price?.toLocaleString()}
                  </p>
                </div>
                <div className="mb-4">
                  <p className="text-muted mb-1">BOOKING AMOUNT</p>
                  <p className="h3">10%</p>
                </div>
                <div className="mb-4">
                  <p className="text-muted mb-1">HANDOVER</p>
                  <p className="h3">2028</p>
                </div>
                <div className="bg-primary text-white p-3 rounded">
                  <p className="h5">Direct Sale</p>
                  <p className="h2">0% COMMISSION</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Overview Section */}
        <div className="mt-5">
          <h2 className="h2 text-primary mb-4">OVERVIEW</h2>
          <div className="row g-4">
            <div className="col-lg-8">
              <div>
                <p className="text-muted">
                  {property.description}
                </p>
                <button 
                  onClick={() => setShowAllOverview(!showAllOverview)}
                  className="btn btn-link text-warning p-0"
                >
                  {showAllOverview ? 'Show Less' : 'Show More'}
                </button>
              </div>
            </div>
            
            {/* Payment Plan */}
            <div className="col-lg-4">
              <div className="card bg-primary text-white">
                <div className="card-body">
                  <h3 className="h4 mb-4">PAYMENT PLAN</h3>
                  <div className="payment-plan">
                    <div className="d-flex justify-content-between mb-3">
                      <span>ON BOOKING</span>
                      <span className="fw-bold">10%</span>
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                      <span>DURING CONSTRUCTION</span>
                      <span className="fw-bold">59%</span>
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                      <span>ON HANDOVER</span>
                      <span className="fw-bold">1%</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>POST HANDOVER</span>
                      <span className="fw-bold">30%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Amenities Section */}
        <div className="mt-5 bg-primary text-white p-4 rounded">
          <h2 className="h2 mb-4">AMENITIES & SERVICES</h2>
          <div className="row g-4">
            {property.amenities?.map((amenity, index) => (
              <div key={index} className="col-6 col-md-3">
                <div className="d-flex align-items-center gap-2">
                  <img src="/api/placeholder/24/24" alt={amenity} width="24" height="24" />
                  <span>{amenity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Floor Plans Section */}
        <div className="mt-5">
          <h2 className="h2 text-primary mb-4">FLOOR PLAN</h2>
          <p className="text-muted mb-4">
            {property.buildingName} brings to you a wide range of floor plans offering studios, 1, 2, 3 and 4-bedroom apartments and penthouses that are no less than a haven of luxury.
          </p>
          <div className="d-flex flex-column gap-3">
            {['Studios', '1 Bedroom', '2 Bedroom', '3 Bedroom', '4 Bedroom'].map((plan) => (
              <button
                key={plan}
                className="btn btn-outline-primary text-start w-100"
              >
                {plan}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyPage;