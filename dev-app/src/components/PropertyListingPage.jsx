import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, RefreshCcw } from 'lucide-react';
import MiniContact from './miniContactComponent.jsx';
import currencySymbols from './currencySymbols.js';
import styles from './PropertyListing.module.css';
import { useNavigate } from 'react-router-dom';

import Footer from './Footer.jsx';
import { ReactCountryFlag } from 'react-country-flag';

const PropertyListingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    listingType: location.state?.listingType || '',
    location: location.state?.location || '',
    query: location.state?.query || '',
    propertyType: location.state?.propertyType || '',
    beds: location.state?.beds || '',
    activeFilters: 0
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sort, setSort] = useState('recent');
  const [selectedCurrency, setSelectedCurrency] = useState('AED');
  const EXCHANGE_RATE = 23.7;

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const params = new URLSearchParams({
          sort: getSortParam()
        });
        const response = await fetch(`http://localhost:5000/api/properties?${params}`);
        const data = await response.json();
        setProperties(data.map(p => ({
          ...p,
          currencySymbol: currencySymbols[p.location]?.[0] || '?'
        })));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching properties:', error);
        setLoading(false);
      }
    };
    fetchProperties();
  }, [filters, sort]);

  const getSortParam = () => {
    switch(sort) {
      case 'price_asc': return 'price=1';
      case 'price_desc': return 'price=-1';
      default: return 'createdAt=-1';
    }
  };

  const handlePropertyClick = (property) => {
    if (property.type === 'sale') {
      navigate(`/sale/${property._id}`);
    } else if (property.type === 'offplan') {
      navigate(`/offplan/${property._id}`);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    const activeCount = Object.entries(newFilters)
      .filter(([k, v]) => k !== 'listingType' && k !== 'activeFilters' && v !== '')
      .length;
    setFilters({ ...newFilters, activeFilters: activeCount });
  };

  const handleReset = () => {
    setFilters({
      listingType: '',
      location: '',
      query: '',
      propertyType: '',
      beds: '',
      activeFilters: 0
    });
    navigate('/propertylisting', { replace: true, state: {} });
  };

  const filteredProperties = properties.filter(property => {
    const isListingTypeMatch = filters.listingType ? 
      property.type === filters.listingType : true;
    const isPropertyTypeMatch = filters.propertyType ? 
      property.propertyType === filters.propertyType : true;
    const isBedCountMatch = filters.beds ? 
      property.bedrooms === filters.beds : true;
    const isLocationMatch = filters.location ? 
      property.location.toLowerCase().includes(filters.location.toLowerCase()) : true;
    const isQueryMatch = filters.query ? 
      [property.area, property.location, property.propertyType].some(text => 
        text.toLowerCase().includes(filters.query.toLowerCase())
      ) : true;

    return isListingTypeMatch && isPropertyTypeMatch && 
      isBedCountMatch && isLocationMatch && isQueryMatch;
  });

  const itemsPerPage = 9;
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const displayedProperties = filteredProperties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => setCurrentPage(page);

  if (loading) return <div className={styles.loader}>Loading...</div>;

  return (
    <>
    {/* <Navbar /> */}
      <div className={styles.container}>
        <div className={styles.filterContainer}>
          <div className="d-flex align-items-center gap-3">
            <div className={styles.toggleGroup}>
              <button 
                className={`${styles.toggleButton} ${
                  filters.listingType === 'sale' ? styles.active : ''
                }`}
                onClick={() => handleFilterChange('listingType', 'sale')}>
                Buy
              </button>
              <button 
                className={`${styles.toggleButton} ${
                  filters.listingType === 'offplan' ? styles.active : ''
                }`}
                onClick={() => handleFilterChange('listingType', 'offplan')}>
                Off-plan
              </button>
            </div>

            <div className="flex-grow-1 d-flex gap-2">
              <div className={styles.searchInput}>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Search by location or area..."
                  value={filters.query}
                  onChange={(e) => handleFilterChange('query', e.target.value)}
                />
                <Search className={styles.searchIcon} size={20} />
              </div>

              <button 
                className={styles.filtersButton}
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>
                Filters ({filters.activeFilters})
                <svg className={styles.filterIcon} viewBox="0 0 16 16" width="17" height="17">
                  <path 
                    fillRule="evenodd" 
                    d="M11.5 2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M9.05 3a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0V3zM4.5 7a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M2.05 8a2.5 2.5 0 0 1 4.9 0H16v1H6.95a2.5 2.5 0 0 1-4.9 0H0V8zm9.45 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m-2.45 1a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0v-1z"
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                  />
                </svg>
              </button>

              <button 
                className={styles.resetButton}
                onClick={handleReset}>
                Reset
              </button>

              <button
    className={styles.resetButton}
    onClick={() => setSelectedCurrency(selectedCurrency === 'AED' ? 'INR' : 'AED')}
  >
    <ReactCountryFlag
      countryCode={selectedCurrency === 'AED' ? 'AE' : 'IN'} // AE for UAE, IN for India
      svg
      style={{
        width: '20px',
        height: '20px',
      }}
      ariaLabel={selectedCurrency === 'AED' ? 'United Arab Emirates' : 'India'}
    />
    {selectedCurrency === 'AED' ? '  AED ' : '  INR '}
  </button>
            </div>
          </div>

          {showAdvancedFilters && (
            <div className={`${styles.advancedFilters} ${styles.slideIn}`}>
              <select 
                className={styles.filterSelect}
                value={filters.propertyType}
                onChange={(e) => handleFilterChange('propertyType', e.target.value)}>
                <option value="">Property Type</option>
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
                <option value="Townhouse">Townhouse</option>
              </select>

              <select 
                className={styles.filterSelect}
                value={filters.beds}
                onChange={(e) => handleFilterChange('beds', e.target.value)}>
                <option value="">Beds</option>
                <option value="Studio">Studio</option>
                <option value="1">1 Bed</option>
                <option value="2">2 Beds</option>
                <option value="3+">3+ Beds</option>
              </select>

              <select 
                className={styles.sortSelect}
                value={sort}
                onChange={(e) => setSort(e.target.value)}>
                <option value="recent">Recently Added</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          )}
        </div>

        <div className="row mb-4 align-items-center">
          <div className="col">
            <h1 className={styles.headingPrimary}>
            Properties in {filters.query || filters.location || filters.area || 'KnightsFin'}
            </h1>
          </div>
        </div>

        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-4">
          {displayedProperties.map(property => (
            <div 
              key={property.id} 
              className="col" 
              onClick={() => handlePropertyClick(property)}
              style={{ cursor: 'pointer' }}
            >
              <div className="card h-100" style={{ borderRadius: "15px", overflow: "hidden", padding: "15px" }}>
                <img 
                  src={property.image} 
                  className={styles.propertyImage} 
                  alt={property.title}
                />
                <div className="card-body">
                  <h3 className={styles.propertyTitle}>{property.buildingName}</h3>
                  <p className={styles.propertyLocation}>{property.developer}</p>
                  <p className={styles.propertyLocation}>{property.location}</p>
                  <p className={styles.propertyType}>
                    {property.bedrooms}, {property.propertyType} - 
                    {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
                  </p>
                  <p className={styles.propertyPrice}>
                    {selectedCurrency === 'AED' ? (
                      `AED ${property.price.toLocaleString()}`
                    ) : (
                      `INR ${Math.round(property.price * EXCHANGE_RATE).toLocaleString()}`
                    )}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <nav className="d-flex justify-content-center">
          <ul className="pagination">
            {Array.from({ length: totalPages }).map((_, index) => (
              <li 
                key={index + 1} 
                className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
              >
                <button className="page-link" onClick={() => handlePageChange(index + 1)}>
                  {index + 1}
                </button>
              </li>
            ))}
            <li className="page-item">
              <button 
                className="page-link" 
                onClick={() => handlePageChange(currentPage + 1 > totalPages ? totalPages : currentPage + 1)}>
                Next
              </button>
            </li>
          </ul>
        </nav>
        <MiniContact />
        <Footer />
      </div>
    </>
  );
};

export default PropertyListingPage;