


import React, { useState } from 'react';
import { Search, MapPin, Home, Bed, RefreshCcw, ChevronDown } from 'lucide-react';
// import './PropertyListing.css';
import miniContact from './miniContactComponent.jsx';
import backgroundImg from '../assets/background-about-us.jpg';

const PropertyListingPage = () => {
  const [location, setLocation] = useState('Dubai');
  const [currentPage, setCurrentPage] = useState(1);

  const [propertyType, setPropertyType] = useState('');
  const [bedCount, setBedCount] = useState('');

  
  const properties = [
    { id: 1, title: 'A BR Apartment for Sale in Binghatti Nova', location: 'JVC District 12, Dubai', type: 'Villa', price: 'AED 1,600,000', image: backgroundImg },
    { id: 2, title: 'B BR Apartment for Sale in Binghatti Nova', location: 'JVC District 12, Dubai', type: 'Apartment', price: 'AED 1,600,000', image: backgroundImg },
    { id: 3, title: 'C BR Apartment for Sale in Binghatti Nova', location: 'JVC District 12, Dubai', type: 'Townhouse', price: 'AED 1,600,000', image: backgroundImg },
    { id: 4, title: 'D BR Apartment for Sale in Binghatti Nova', location: 'JVC District 12, Dubai', type: 'Villa', price: 'AED 1,600,000', image: backgroundImg },
    { id: 5, title: '2 BR Apartment for Sale in Binghatti Nova', location: 'JVC District 12, Dubai', type: 'Apartment', price: 'AED 1,600,000', image: backgroundImg },
    { id: 6, title: '2 BR Apartment for Sale in Binghatti Nova', location: 'JVC District 12, Dubai', type: 'Townhouse', price: 'AED 1,600,000', image: backgroundImg },
    { id: 7, title: '2 BR Apartment for Sale in Binghatti Nova', location: 'JVC District 12, Dubai', type: 'Villa', price: 'AED 1,600,000', image: backgroundImg },
    { id: 8, title: '2 BR Apartment for Sale in Binghatti Nova', location: 'JVC District 12, Dubai', type: 'Apartment', price: 'AED 1,600,000', image: backgroundImg },
    { id: 9, title: '2 BR Apartment for Sale in Binghatti Nova', location: 'JVC District 12, Dubai', type: 'Townhouse', price: 'AED 1,600,000', image: backgroundImg },
    { id: 10, title: '2 BR Apartment for Sale in Binghatti Nova', location: 'JVC District 12, Dubai', type: 'Villa', price: 'AED 1,600,000', image: backgroundImg },
    { id: 11, title: '2 BR Apartment for Sale in Binghatti Nova', location: 'JVC District 12, Dubai', type: 'Apartment', price: 'AED 1,600,000', image: backgroundImg },
    // Add more properties as needed
  ];

  const itemsPerPage = 9;
  const totalPages = Math.ceil(properties.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePropertyTypeChange = (e) => {
    setPropertyType(e.target.value);
  };
  
  const handleBedCountChange = (e) => {
    setBedCount(e.target.value);
  };
  
  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  // Apply filters to properties
  const filteredProperties = properties.filter((property) => {
    const isPropertyTypeMatch = propertyType ? property.type === propertyType : true;
    const isLocationMatch = location ? property.location.includes(location) : true;
    const isBedCountMatch = bedCount ? property.beds === parseInt(bedCount) : true;

    return isPropertyTypeMatch && isLocationMatch && isBedCountMatch;
  });
  

  // Get properties for the current page
  const displayedProperties = properties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container py-5">
      {/* Search Filters */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex flex-wrap gap-3">
            <div className="btn-group">
              <button className="btn btn-primary">Buy</button>
              <button className="btn btn-warning">Rent</button>
            </div>
            
            <div className="flex-grow-1">
              <div className="row g-3">
                <div className="col-12 col-md">
                  <div className="position-relative">
                    <input 
                      type="text" 
                      className="form-control ps-5" 
                      placeholder="Type keyword..."
                    />
                    <Search className="position-absolute search-icon" size={20} />
                  </div>
                </div>
                
                <div className="col-12 col-md-auto">
                  <select className="form-select" onChange={handlePropertyTypeChange}>
                    <option>Property Type</option>
                    <option>Apartment</option>
                    <option>Villa</option>
                    <option>Townhouse</option>
                  </select>
                </div>
                
                <div className="col-12 col-md-auto">
                  <select 
                    className="form-select"
                    onChange={handleLocationChange}
                  >
                    <option value="Dubai">Dubai</option>
                    <option value="Abu Dhabi">Abu Dhabi</option>
                    <option value="Sharjah">Sharjah</option>
                  </select>
                </div>
                
                <div className="col-12 col-md-auto">
                  <select className="form-select" onChange={handleBedCountChange}>
                    <option>Beds</option>
                    <option>Studio</option>
                    <option>1 Bed</option>
                    <option>2 Beds</option>
                    <option>3+ Beds</option>
                  </select>
                </div>
                
                <div className="col-12 col-md-auto">
                  <button className="btn btn-warning d-flex align-items-center gap-2">
                    <RefreshCcw size={20} />
                    Reset filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Heading and Sort */}
      <div className="row mb-4 align-items-center">
        <div className="col">
          <h1 className="heading-primary">Properties for sale in {location}.</h1>
        </div>
        <div className="col-auto">
          <select className="form-select">
            <option>Select...</option>
            <option>A to Z</option>
            <option>Z to A</option>
            <option>Newest First</option>
            <option>Oldest First</option>
          </select>
        </div>
      </div>

      {/* Property Cards Grid */}
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-4">
        {displayedProperties.map((property) => (
          <div key={property.id} className="col">
            <div className="card h-100">
              <img 
                src={property.image} 
                className="card-img-top property-image" 
                alt={property.title}
              />
              <div className="card-body">
                <h3 className="card-title property-title">{property.title}</h3>
                <p className="card-text property-location">{property.location}</p>
                <p className="card-text property-type">{property.type}</p>
                <p className="card-text property-price">{property.price}</p>
                {/* <div className="d-flex gap-3">
                  <button className="btn btn-outline-secondary flex-grow-1">Email</button>
                  <button className="btn btn-outline-secondary flex-grow-1">Phone</button>
                  <button className="btn btn-outline-secondary flex-grow-1">WhatsApp</button>
                </div> */}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <nav className="d-flex justify-content-center">
        <ul className="pagination">
          {Array.from({ length: totalPages }).map((_, index) => (
            <li 
              key={index + 1} 
              className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
            >
              <button 
                className="page-link" 
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            </li>
          ))}
          <li className="page-item">
            <button 
              className="page-link" 
              onClick={() => handlePageChange(currentPage + 1 > totalPages ? totalPages : currentPage + 1)}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
      <miniContact />
    </div>
  );
};

export default PropertyListingPage;
