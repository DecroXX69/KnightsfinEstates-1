


// import React, { useState } from 'react';
// import { Search, MapPin, Home, Bed, RefreshCcw, ChevronDown } from 'lucide-react';
// import './PropertyListing.module.css';
// import miniContact from './miniContactComponent.jsx';
// import backgroundImg from '../assets/background-about-us.jpg';

// const PropertyListingPage = () => {
//   const [location, setLocation] = useState('Dubai');
//   const [currentPage, setCurrentPage] = useState(1);

//   const [propertyType, setPropertyType] = useState('');
//   const [bedCount, setBedCount] = useState('');

  
//   const properties = [
//     { id: 1, title: 'A BR Apartment for Sale in Binghatti Nova', location: 'JVC District 12, Dubai', type: 'Villa', price: 'AED 1,600,000', image: backgroundImg },
//     { id: 2, title: 'B BR Apartment for Sale in Binghatti Nova', location: 'JVC District 12, Dubai', type: 'Apartment', price: 'AED 1,600,000', image: backgroundImg },
//     { id: 3, title: 'C BR Apartment for Sale in Binghatti Nova', location: 'JVC District 12, Dubai', type: 'Townhouse', price: 'AED 1,600,000', image: backgroundImg },
//     { id: 4, title: 'D BR Apartment for Sale in Binghatti Nova', location: 'JVC District 12, Dubai', type: 'Villa', price: 'AED 1,600,000', image: backgroundImg },
//     { id: 5, title: '2 BR Apartment for Sale in Binghatti Nova', location: 'JVC District 12, Dubai', type: 'Apartment', price: 'AED 1,600,000', image: backgroundImg },
//     { id: 6, title: '2 BR Apartment for Sale in Binghatti Nova', location: 'JVC District 12, Dubai', type: 'Townhouse', price: 'AED 1,600,000', image: backgroundImg },
//     { id: 7, title: '2 BR Apartment for Sale in Binghatti Nova', location: 'JVC District 12, Dubai', type: 'Villa', price: 'AED 1,600,000', image: backgroundImg },
//     { id: 8, title: '2 BR Apartment for Sale in Binghatti Nova', location: 'JVC District 12, Dubai', type: 'Apartment', price: 'AED 1,600,000', image: backgroundImg },
//     { id: 9, title: '2 BR Apartment for Sale in Binghatti Nova', location: 'JVC District 12, Dubai', type: 'Townhouse', price: 'AED 1,600,000', image: backgroundImg },
//     { id: 10, title: '2 BR Apartment for Sale in Binghatti Nova', location: 'JVC District 12, Dubai', type: 'Villa', price: 'AED 1,600,000', image: backgroundImg },
//     { id: 11, title: '2 BR Apartment for Sale in Binghatti Nova', location: 'JVC District 12, Dubai', type: 'Apartment', price: 'AED 1,600,000', image: backgroundImg },
//     // Add more properties as needed
//   ];

//   const itemsPerPage = 9;
//   const totalPages = Math.ceil(properties.length / itemsPerPage);

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   const handlePropertyTypeChange = (e) => {
//     setPropertyType(e.target.value);
//   };
  
//   const handleBedCountChange = (e) => {
//     setBedCount(e.target.value);
//   };
  
//   const handleLocationChange = (e) => {
//     setLocation(e.target.value);
//   };

//   // Apply filters to properties
//   const filteredProperties = properties.filter((property) => {
//     const isPropertyTypeMatch = propertyType ? property.type === propertyType : true;
//     const isLocationMatch = location ? property.location.includes(location) : true;
//     const isBedCountMatch = bedCount ? property.beds === parseInt(bedCount) : true;

//     return isPropertyTypeMatch && isLocationMatch && isBedCountMatch;
//   });
  

//   // Get properties for the current page
//   const displayedProperties = properties.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   return (
//     <div className="container py-5">
//       {/* Search Filters */}
//       <div className="row mb-4">
//         <div className="col-12">
//           <div className="d-flex flex-wrap gap-3">
//             <div className="btn-group">
//               <button className="btn btn-primary">Buy</button>
//               <button className="btn btn-warning">Rent</button>
//             </div>
            
//             <div className="flex-grow-1">
//               <div className="row g-3">
//                 <div className="col-12 col-md">
//                   <div className="position-relative">
//                     <input 
//                       type="text" 
//                       className="form-control ps-5" 
//                       placeholder="Type keyword..."
//                     />
//                     <Search className="position-absolute search-icon" size={20} />
//                   </div>
//                 </div>
                
//                 <div className="col-12 col-md-auto">
//                   <select className="form-select" onChange={handlePropertyTypeChange}>
//                     <option>Property Type</option>
//                     <option>Apartment</option>
//                     <option>Villa</option>
//                     <option>Townhouse</option>
//                   </select>
//                 </div>
                
//                 <div className="col-12 col-md-auto">
//                   <select 
//                     className="form-select"
//                     onChange={handleLocationChange}
//                   >
//                     <option value="Dubai">Dubai</option>
//                     <option value="Abu Dhabi">Abu Dhabi</option>
//                     <option value="Sharjah">Sharjah</option>
//                   </select>
//                 </div>
                
//                 <div className="col-12 col-md-auto">
//                   <select className="form-select" onChange={handleBedCountChange}>
//                     <option>Beds</option>
//                     <option>Studio</option>
//                     <option>1 Bed</option>
//                     <option>2 Beds</option>
//                     <option>3+ Beds</option>
//                   </select>
//                 </div>
                
//                 <div className="col-12 col-md-auto">
//                   <button className="btn btn-warning d-flex align-items-center gap-2">
//                     <RefreshCcw size={20} />
//                     Reset filters
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Heading and Sort */}
//       <div className="row mb-4 align-items-center">
//         <div className="col">
//           <h1 className="heading-primary">Properties for sale in {location}.</h1>
//         </div>
//         <div className="col-auto">
//           <select className="form-select">
//             <option>Select...</option>
//             <option>A to Z</option>
//             <option>Z to A</option>
//             <option>Newest First</option>
//             <option>Oldest First</option>
//           </select>
//         </div>
//       </div>

//       {/* Property Cards Grid */}
//       <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-4">
//         {displayedProperties.map((property) => (
//           <div key={property.id} className="col">
//             <div className="card h-100">
//               <img 
//                 src={property.image} 
//                 className="card-img-top property-image" 
//                 alt={property.title}
//               />
//               <div className="card-body">
//                 <h3 className="card-title property-title">{property.title}</h3>
//                 <p className="card-text property-location">{property.location}</p>
//                 <p className="card-text property-type">{property.type}</p>
//                 <p className="card-text property-price">{property.price}</p>
//                 {/* <div className="d-flex gap-3">
//                   <button className="btn btn-outline-secondary flex-grow-1">Email</button>
//                   <button className="btn btn-outline-secondary flex-grow-1">Phone</button>
//                   <button className="btn btn-outline-secondary flex-grow-1">WhatsApp</button>
//                 </div> */}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Pagination */}
//       <nav className="d-flex justify-content-center">
//         <ul className="pagination">
//           {Array.from({ length: totalPages }).map((_, index) => (
//             <li 
//               key={index + 1} 
//               className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
//             >
//               <button 
//                 className="page-link" 
//                 onClick={() => handlePageChange(index + 1)}
//               >
//                 {index + 1}
//               </button>
//             </li>
//           ))}
//           <li className="page-item">
//             <button 
//               className="page-link" 
//               onClick={() => handlePageChange(currentPage + 1 > totalPages ? totalPages : currentPage + 1)}
//             >
//               Next
//             </button>
//           </li>
//         </ul>
//       </nav>
//       <miniContact />
//     </div>
//   );
// };

// export default PropertyListingPage;








import React, { useState, useEffect } from 'react';
import { Search, RefreshCcw } from 'lucide-react';
import miniContact from './miniContactComponent.jsx';
import backgroundImg from '../assets/background-about-us.jpg';
import backgroundImg1 from '../assets/background1.jpg';
import backgroundImg2 from '../assets/backgroud2.jpg';
import backgroundImg3 from '../assets/background3.jpg';
import styles from './PropertyListing.module.css';

const PropertyListingPage = () => {
  const [location, setLocation] = useState('Dubai');
  const [currentPage, setCurrentPage] = useState(1);
  const [propertyType, setPropertyType] = useState('');
  const [bedCount, setBedCount] = useState('');
  const [properties, setProperties] = useState([]);  // State to store properties
  const [loading, setLoading] = useState(true);  // State to track loading
  const [filters, setFilters] = useState({
    listingType: 'Sale',
    location: '',
    propertyType: '',
    beds: '',
    activeFilters: 0
  });

  // const properties = [
  //   { id: 1, title: 'A BR Apartment for Sale in Binghatti Nova', location: 'JVC District 12, Sharjah', type: 'Villa', price: 'AED 1,600,000',beds: "Studio", image: backgroundImg1 },
  //   { id: 2, title: 'B BR Apartment for Sale in Binghatti Nova', location: 'JVC District 12, Dubai', type: 'Apartment', price: 'AED 1,600,000',beds: "1 Bed", image: backgroundImg2 },
  //   { id: 3, title: 'C BR Apartment for Sale in Binghatti Nova', location: 'JVC District 12, Abu Dhabi', type: 'Townhouse', price: 'AED 1,600,000',beds: "Studio", image: backgroundImg3 },
  //   { id: 4, title: 'D BR Apartment for Sale in Binghatti Nova', location: 'JVC District 12, Dubai', type: 'Villa', price: 'AED 1,600,000',beds: "1 Bed", image: backgroundImg2 },
  //   { id: 5, title: '2 BR Apartment for Sale in Binghatti Nova', location: 'JVC District 12, Dubai', type: 'Apartment', price: 'AED 1,600,000',beds: "3 Beds", image: backgroundImg1 },
  //   { id: 6, title: '2 BR Apartment for Sale in Binghatti Nova', location: 'JVC District 12, Jumeraah', type: 'Townhouse', price: 'AED 1,600,000',beds: "Studio", image: backgroundImg2 },
  //   { id: 7, title: '2 BR Apartment for Sale in Binghatti Nova', location: 'JVC District 12, Dubai', type: 'Villa', price: 'AED 1,600,000',beds: "2 Beds", image: backgroundImg3 },
  //   { id: 8, title: '2 BR Apartment for Sale in Binghatti Nova', location: 'JVC District 12, Dubai', type: 'Apartment', price: 'AED 1,600,000',beds: "2 Beds", image: backgroundImg3 },
  //   { id: 9, title: '2 BR Apartment for Sale in Binghatti Nova', location: 'JVC District 12, Dubai', type: 'Townhouse', price: 'AED 1,600,000',beds: "1 Bed", image: backgroundImg1 },
  //   { id: 10, title: '2 BR Apartment for Sale in Binghatti Nova', location: 'JVC District 12, Dubai', type: 'Villa', price: 'AED 1,600,000',beds: "3 Beds", image: backgroundImg2 },
  //   { id: 11, title: '2 BR Apartment for Sale in Binghatti Nova', location: 'JVC District 12, Dubai', type: 'Apartment', price: 'AED 1,600,000',beds: "2 Beds", image: backgroundImg3 },
  // ];

  // Fetch data from backend API
 
 
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/properties');
        const data = await response.json();
        setProperties(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching properties:', error);
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);


  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    // Count active filters (excluding listingType)
    const activeCount = Object.entries(newFilters)
      .filter(([k, v]) => k !== 'listingType' && k !== 'activeFilters' && v !== '')
      .length;
    setFilters({ ...newFilters, activeFilters: activeCount });
  };

  const handleReset = () => {
    setFilters({
      listingType: 'Sale',
      location: '',
      propertyType: '',
      beds: '',
      activeFilters: 0
    });
  };

  const itemsPerPage = 9;
  const totalPages = Math.ceil(properties.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePropertyTypeChange = (e) => {
    setPropertyType(e.target.value);
  };

  const handleBedCountChange = (e) => {
    // setBedCount(e.target.value);
    const value = e.target.value;
  setBedCount(value);
  };

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  // Apply filters to properties
  const filteredProperties = properties.filter((property) => {
    // const isPropertyTypeMatch = propertyType ? property.type === propertyType : true;
    const isPropertyTypeMatch = filters.propertyType ? property.type === filters.propertyType : true;
    const isLocationMatch = filters.location ? property.location.toLowerCase().includes(filters.location.toLowerCase()) : true;
    const isBedCountMatch = bedCount ? (bedCount === "Studio" ? property.beds === "Studio" : property.beds === bedCount) : true;
    // const isBedCountMatch = bedCount ? property.beds === parseInt(bedCount) : true;

    return isPropertyTypeMatch && isLocationMatch && isBedCountMatch;
  });
  

  // Get properties for the current page
  const displayedProperties = filteredProperties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className={styles.container}>
      {/* Search Filters */}
      {/* <div className="row mb-4">
        <div className="col-10">
          <div className="d-flex flex-wrap gap-3 align-items-center">
            <div className="btn-group">
              <button className="btn btn-primary">Buy</button>
              <button className="btn btn-warning">Rent</button>
            </div>
            
            <div className="flex-grow-1">
              <div className="row g-2">
                <div className="col-10 col-md">
                  <div className="position-relative">
                    <input 
                      type="text" 
                      className="form-control ps-5" 
                      placeholder="Type keyword..."
                    />
                    <Search className={styles.searchIcon} size={20} />
                  </div>
                </div>
                
                <div className="col-10 col-md-auto">
                  <select className="form-select" onChange={handlePropertyTypeChange}>
                    <option>Property Type</option>
                    <option>Apartment</option>
                    <option>Villa</option>
                    <option>Townhouse</option>
                  </select>
                </div>
                
                <div className="col-10 col-md-auto">
                  <select className="form-select" onChange={handleLocationChange}>
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
      </div> */}
      <div className={styles.filterContainer}>
      <div className="d-flex flex-wrap align-items-center gap-3">
        {/* Buy/Rent Toggle */}
        <div className={styles.toggleGroup}>
          <button 
            className={`${styles.toggleButton} ${filters.listingType === 'Buy' ? styles.active : ''}`}
            onClick={() => handleFilterChange('listingType', 'Buy')}
          >
            <div className="d-flex align-items-center gap-2">
              <svg className={styles.checkIcon} viewBox="0 0 24 24" width="20" height="20">
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
                <path d="M8 12l3 3 5-5" fill="none" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Buy
            </div>
          </button>
          <button 
            className={`${styles.toggleButton} ${filters.listingType === 'Rent' ? styles.active : ''}`}
            onClick={() => handleFilterChange('listingType', 'Rent')}
          >
            Rent
          </button>
        </div>

        {/* Filters Section */}
        <div className="flex-grow-1 d-flex gap-2">
          {/* Location Search */}
          <div className={`position-relative ${styles.searchInput}`}>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Location..."
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
            />
            <Search className={styles.searchIcon} size={20} />
          </div>

          {/* Property Type Dropdown */}
          <select 
            className={`form-select ${styles.filterSelect}`}
            value={filters.propertyType}
            onChange={(e) => handleFilterChange('propertyType', e.target.value)}
          >
            <option value="">Property Type</option>
            <option value="Apartment">Apartment</option>
            <option value="Villa">Villa</option>
            <option value="Townhouse">Townhouse</option>
          </select>

          {/* Beds Dropdown */}
          <select 
            className={`form-select ${styles.filterSelect}`}
            value={filters.beds}
            onChange={(e) => handleFilterChange('beds', e.target.value)}
          >
            <option value="">Beds</option>
            <option value="Studio">Studio</option>
            <option value="1">1 Bed</option>
            <option value="2">2 Beds</option>
            <option value="3+">3+ Beds</option>
          </select>

          {/* Filters Button */}
          {/* <button className={styles.filtersButton}>
            Filters
            {filters.activeFilters > 0 && (
              <span className={styles.filterBadge}>{filters.activeFilters}</span>
            )}
          </button> */}
          <button className={styles.filtersButton}>
  Filters
  {filters.activeFilters > 0 && (
    <span className={styles.filterBadge}>{filters.activeFilters}</span>
  )}
  <svg className={styles.filtericon} viewBox="0 0 16 16" width="17" height="17">
    <path 
      fillRule="evenodd" 
      d="M11.5 2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M9.05 3a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0V3zM4.5 7a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M2.05 8a2.5 2.5 0 0 1 4.9 0H16v1H6.95a2.5 2.5 0 0 1-4.9 0H0V8zm9.45 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m-2.45 1a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0v-1z"
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
    />
  </svg>
</button>


          {/* Reset Button */}
          <button 
            className={styles.resetButton}
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
      

      {/* Heading and Sort */}
      <div className="row mb-4 align-items-center">
        <div className="col">
          <h1 className={styles.headingPrimary}>Properties for sale in {location}<span style={{color:'orange'}}>.</span></h1>
        </div>
        {/* <div className="col-auto">
          <select className="form-select">
            <option>Select...</option>
            <option>A to Z</option>
            <option>Z to A</option>
            <option>Newest First</option>
            <option>Oldest First</option>
          </select>
        </div> */}
      </div>

      {/* Property Cards Grid */}
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-4">
        {filteredProperties.map((property) => (
          <div key={property.id} className="col">
            <div className="card h-100" style={{ borderRadius: "15px", overflow: "hidden", padding: "15px" }}>
              <img 
                src={property.image} 
                className={styles.propertyImage} 
                alt={property.title}
              />
              <div className="card-body">
                <h3 className={styles.propertyTitle}>{property.title}</h3>
                <p className={styles.propertyLocation}>{property.location}</p>
                <p className={styles.propertyType}>{property.beds}, {property.type}</p>
                <p className={styles.propertyPrice}>{property.price}</p>
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
