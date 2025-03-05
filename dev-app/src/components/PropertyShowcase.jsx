import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';

const PropertyShowcase = ({ selectedLocation, activeLocation }) => {
  const [properties, setProperties] = useState([]);
  const [displayedProperties, setDisplayedProperties] = useState([]);
  const [listingType, setListingType] = useState('sale');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3); // Number of properties to show

  useEffect(() => {
    fetchProperties();
  }, [activeLocation, selectedLocation, listingType]);

  const fetchProperties = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/properties?location=${activeLocation}&area=${selectedLocation}&type=${listingType}`
      );
      const data = await response.json();
      setProperties(data);
      setDisplayedProperties(data.slice(0, visibleCount));
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const handleLoadMore = () => {
    const newVisibleCount = visibleCount + 3;
    setVisibleCount(newVisibleCount);
    setDisplayedProperties(properties.slice(0, newVisibleCount));
  };

  const navigate = useNavigate();

  const handleExplore = (propertyId) => {
    navigate(`/property/${propertyId}`);
  };

  return (
    <Container className="py-5">
      <h1 className="display-4 mb-3"  style={{
        color: "black",
        fontFamily: "'Juana W05 Light', serif",
        fontWeight: 600,
      }}>
        Latest Properties for Sale in{' '}
        <span className="text-primary"
        style={{
          fontFamily: "'Poppins', sans-serif",
          fontWeight: 400,
        }}>
          {selectedLocation ? `${selectedLocation}, ${activeLocation}` : activeLocation}
        </span>
      </h1>

      <p className="text-muted lead mb-4">
        Find your perfect home that suits your budget and lifestyle in {activeLocation}.
        From apartments, villas, townhouses to penthouses, we have got you covered! Our
        curated selection of properties reflect the best of what{' '}
        {selectedLocation ? ` ${selectedLocation}` : ` ${activeLocation}`} has to offer.
      </p>

      <div className="mb-4">
        <Button
          variant={listingType === 'sale' ? 'primary' : 'light'}
          className="me-3 rounded-pill px-4"
          onClick={() => setListingType('sale')}
        >
          For Sale</Button>
   
      </div>

      <Row className="g-4">
        {displayedProperties.map((property) => (
          <Col key={property._id} md={4}>
            <Card className="h-100 border-0 shadow-sm property-card">
              <div
                className="property-image"
                onClick={() => handleExplore(property._id)}
                style={{
                  backgroundImage: `url(${property.image})`,
                  height: '250px',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <Card.Body>
                <small className="text-primary mb-2 d-block">{property.developer}</small>
                <Card.Title className="h5 mb-3">{property.buildingName}</Card.Title>
                <div className="mb-3">
                  <span className="h4 text-warning fw-bold">
                    AED {property.price.toLocaleString()}
                  </span>
                </div>
                <Button
                  variant="link"
                  className="text-primary p-0 text-decoration-none"
                  onClick={() => handleExplore(property._id)}
                >
                  Explore
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {visibleCount < properties.length && (
        <div className="text-center mt-4">
        <Button
  className="rounded-full px-6 py-2 text-sm font-medium tracking-wider uppercase 
  transition-all duration-300 ease-in-out 
  bg-[#FFD700] 
  text-[#1a1f3d] 
  hover:bg-[#FFC107] 
  hover:shadow-lg 
  focus:outline-none 
  active:scale-105"
  style={{ 
    backgroundColor: '#ffa726', 
    color: '#1a1f3d', 
    border: '2px solid #ffa726'
  }}
  onClick={handleLoadMore}
>
  Load More
</Button>
        </div>
      )}

      <style>
        {`
          .property-card {
            transition: transform 0.3s ease;
          }
          .property-card:hover {
            transform: translateY(-5px);
          }
          .property-image {
            cursor: pointer;
            transition: opacity 0.3s ease;
          }
          .property-image:hover {
            opacity: 0.9;
          }
        `}
      </style>
    </Container>
  );
};

export default PropertyShowcase;
