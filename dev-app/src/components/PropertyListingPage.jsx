import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Search, RefreshCcw } from 'lucide-react';
import MiniContact from './miniContactComponent.jsx';
import currencySymbols from './currencySymbols.js';
import styles from './PropertyListing.module.css';
import Footer from './Footer.jsx';
import { ReactCountryFlag } from 'react-country-flag';
import logo1 from "../assets/logo.webp";
import axios from 'axios';

const PropertyListingPage = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(''); // Local state for input field
  const [filters, setFilters] = useState({
    listingType: '',
    query: '',
    propertyType: '',
    beds: '',
    activeFilters: 0
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sort, setSort] = useState('recent');
  const [selectedCurrency, setSelectedCurrency] = useState('INR');
  const [searchParams, setSearchParams] = useSearchParams();
  const EXCHANGE_RATE = 23.7;

  // Initialize from URL params
  useEffect(() => {
    const locationParam = searchParams.get('location') || '';
    const queryParam = searchParams.get('query') || '';
    const initialQuery = locationParam || queryParam || '';
    
    // Set both the filter query and the input field value
    if (initialQuery) {
      setFilters(prev => ({
        ...prev,
        query: initialQuery,
        activeFilters: initialQuery ? 1 : 0
      }));
      setSearchInput(initialQuery);
    }
  }, [searchParams]);

  // Debounced search function using useCallback
  const debouncedSearch = useCallback(
    // Create a debounced version of our search function
    (() => {
      let timer;
      return (searchValue) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          // Only update URL if value is different from current filter
          if (searchValue !== filters.query) {
            // Update filters state
            setFilters(prev => ({
              ...prev,
              query: searchValue,
              activeFilters: searchValue ? 1 : 0
            }));
            
            // Update URL parameters
            const newParams = new URLSearchParams(searchParams);
            
            // Clear both location and query params before setting new one
            newParams.delete('location');
            
            if (searchValue) {
              newParams.set('query', searchValue);
            } else {
              newParams.delete('query');
            }
            
            setSearchParams(newParams);
          }
        }, 1500); // Wait 800ms after last keystroke before triggering search
      };
    })(),
    [searchParams, filters.query, setSearchParams]
  );

  // Fetch properties when filters or sort changes
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        
        const params = new URLSearchParams({
          sort: getSortParam(),
          ...(filters.query && { query: filters.query })
        });
        
        const response = await fetch(`https://knightsfinestates-backend-1.onrender.com/api/properties?${params}`);
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
    switch (sort) {
      case 'price_asc': return 'price=1';
      case 'price_desc': return 'price=-1';
      default: return 'createdAt=-1';
    }
  };

  const handlePropertyClick = async (property) => {
    try {
      // Send PATCH request to increment view count
      await axios.patch(`https://knightsfinestates-backend-1.onrender.com/api/${property._id}/view`);
    } catch (error) {
      console.error('Error updating view count:', error);
    } finally {
      // Navigate to the property page regardless of view count update success
      if (property.type === 'sale') {
        navigate(`/sale/${property._id}`);
      } else if (property.type === 'offplan') {
        navigate(`/offplan/${property._id}`);
      }
    }
  };

  const handleFilterChange = (key, value) => {
    // For all filters except query, update immediately
    if (key !== 'query') {
      const newFilters = { ...filters, [key]: value };
      const activeCount = Object.entries(newFilters)
        .filter(([k, v]) => k !== 'listingType' && k !== 'activeFilters' && v !== '')
        .length;
      
      setFilters({ ...newFilters, activeFilters: activeCount });
    }
  };

  // Handle input change separately from filter updates
  const handleSearchInputChange = (value) => {
    setSearchInput(value);
    debouncedSearch(value);
  };

  const handleReset = () => {
    setFilters({
      listingType: '',
      query: '',
      propertyType: '',
      beds: '',
      activeFilters: 0
    });
    setSearchInput('');
    
    // Clear all search parameters
    navigate('/propertylisting');
  };

  const filteredProperties = properties.filter(property => {
    const isListingTypeMatch = filters.listingType ? 
      property.type === filters.listingType : true;
    const isPropertyTypeMatch = filters.propertyType ? 
      property.propertyType === filters.propertyType : true;
    const isBedCountMatch = filters.beds ? 
      property.bedrooms === filters.beds : true;
    
    const isQueryMatch = filters.query ? 
      [property.location, property.area, property.buildingName].some(text => {
        if (!text) return false;
        const query = filters.query.toLowerCase();
        const textLower = text.toLowerCase();
        
        // Check if query is a substring of the text
        return textLower.includes(query) || query.includes(textLower);
      }) : true;

    return isListingTypeMatch && isPropertyTypeMatch && 
      isBedCountMatch && isQueryMatch;
  });

  // Sort properties to show sold properties first
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    // First sort by sold status (available properties first)
    if ((a.subStatus !== 'sold') && (b.subStatus === 'sold')) return -1;
    if ((a.subStatus === 'sold') && (b.subStatus !== 'sold')) return 1;
    return 0;
  });

  const itemsPerPage = 9;
  const totalPages = Math.ceil(sortedProperties.length / itemsPerPage);
  const displayedProperties = sortedProperties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => setCurrentPage(page);

  if (loading) return (
    <div className={styles.loader}>
      <div className={styles.loaderContent}>
        <img src={logo1} alt="Logo" className={styles.logo} />
        <div className={styles.spinner}></div>
      </div>
    </div>
  );

  return (
    <>
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
                  value={searchInput}
                  onChange={(e) => handleSearchInputChange(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      // Apply search immediately when Enter is pressed
                      debouncedSearch(searchInput);
                    }
                  }}
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
                  countryCode={selectedCurrency === 'AED' ? 'AE' : 'IN'}
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
              Properties in {filters.query || 'KnightsFin'}
            </h1>
          </div>
        </div>

        {filteredProperties.length === 0 ? (
          <div className="row">
            <div className="col text-center">
              <p className={styles.noPropertiesFound}>No properties found</p>
            </div>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-4">
            {displayedProperties.map(property => (
              <div 
                key={property._id} 
                className="col" 
                onClick={() => handlePropertyClick(property)}
                style={{ cursor: 'pointer' }}
              >
                <div className="card h-100" style={{ borderRadius: "15px", overflow: "hidden", padding: "15px" }}>
                  <div className={styles.imageContainer} style={{ position: "relative" }}>
                    <img 
                      src={property.image} 
                      className={`${styles.propertyImage} ${property.subStatus === 'sold' ? styles.grayscaleImage : ''}`} 
                      alt={property.title}
                    />
                    
                    {/* Hot Property Badge */}
                    {property.Trend === 'Hot' && (
                      <div className={styles.hotBadge}>🔥 Hot Property</div>
                    )}
                    
                    {/* Property Status Badges */}
                    {property.subStatus === 'sold' && (
                      <div className={styles.soldBadge}>SOLD</div>
                    )}
                    {property.subStatus === 'available' && (
                      <div className={styles.availableBadge}>Ready to Move</div>
                    )}
                    {property.subStatus === 'Under Construction' && (
                      <div className={styles.constructionBadge}>Under Construction</div>
                    )}
                  </div>
                  <div className="card-body">
                    <h3 className={styles.propertyTitle}>{property.buildingName}</h3>
                    <p className={styles.propertyLocation}>{property.developer}</p>
                    <p className={styles.propertyLocation}>{property.location}</p>
                    <p className={styles.propertyType}>
                      {property.bedrooms}-Bed {property.propertyType} - 
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
        )}

        {filteredProperties.length > 0 && (
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
        )}
        
      </div>
      <Footer />
    </>
  );
};

export default PropertyListingPage;