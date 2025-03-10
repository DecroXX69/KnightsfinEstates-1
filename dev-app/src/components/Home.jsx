import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronDown, 
  Home as HomeIcon,
  Landmark as CastleIcon,
  Building as BuildingIcon,
  Hotel as PenthouseIcon, 
  Contact
} from 'lucide-react';

// Component imports
import FloatingChat from '../services/FloatingChat';
import PropertyShowcase from './PropertyShowcase';
import LuxuryProperty from '../minicomponents/LuxuryProperty';
import PartnersSlider from '../minicomponents/PartnerSlider';
import About from '../minicomponents/About';
import Testimonials from './Testimonials';
import Footer from './Footer';
import ContactUs from './ContactUs';
import Trusted from '../minicomponents/Trusted';
import Timeless from '../minicomponents/Timeless';

const locationData = {
  Pune: {
    title: "Find The Best Pune Real Estate Property",
    subtitle: "Explore Pune's finest real estate properties today",
    videoUrl: dubai,
    locations: ["Wakad", "Baner", "Punawale", "Kiwale", "Ravet"],
    flag: "PN",
    initials: "PNQ"
  },
  Dubai: {
    title: "Find The Best Dubai Real Estate Property",
    subtitle: "Explore Dubai's finest real estate properties today",
    videoUrl: dubai,
    locations: ["Downtown Dubai", "Arabian Ranches", "Dubai Hills", "Palm Jumeirah", "Dubai Marina"],
    flag: "🇦🇪",
    initials: "DXB"
  },
  Thailand: {
    title: "Discover Premium Thailand Properties",
    subtitle: "Explore Thailand's most exclusive real estate opportunities",
    videoUrl: thailand,
    locations: ["Phuket", "Pattaya", "Koh Samui", "Chiang Mai", "Hua Hin"],
    flag: "🇹🇭",
    initials: "TH"
  },
  Bangkok: {
    title: "Premium Bangkok Real Estate",
    subtitle: "Find your perfect property in the heart of Bangkok",
    videoUrl: "/videos/bangkok.mp4",
    locations: ["Sukhumvit", "Silom", "Sathorn", "Thonglor", "Asoke"],
    flag: "🇹🇭",
    initials: "BKK"
  },
  Greece: {
    title: "Luxurious Greek Properties",
    subtitle: "Experience the finest Mediterranean real estate",
    videoUrl: "/videos/greece.mp4",
    locations: ["Athens", "Santorini", "Mykonos", "Crete", "Rhodes"],
    flag: "🇬🇷",
    initials: "GR"
  },
  Cyprus: {
    title: "Elite Cyprus Real Estate",
    subtitle: "Discover pristine properties in Cyprus",
    videoUrl: "/videos/cyprus.mp4",
    locations: ["Limassol", "Paphos", "Larnaca", "Nicosia", "Famagusta"],
    flag: "🇨🇾",
    initials: "CY"
  },
};

const Home = () => {
  const navigate = useNavigate();
  const [activeLocation, setActiveLocation] = useState('Pune');
  const [listingType, setListingType] = useState('sale');
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  const handleListingTypeChange = (type) => {
    setListingType(type);
  };

  const handleSearch = () => {
    // Create search parameters similar to PropertyListing page
    const searchParams = new URLSearchParams();
    
    // Add query parameter for the search text (similar to PropertyListing's query filter)
    if (searchQuery) {
      searchParams.set('query', searchQuery);
    }
    
    // Add area parameter if a specific location is selected
    if (selectedLocation) {
      searchParams.set('area', selectedLocation);
    }

    navigate(`/propertylisting?${searchParams.toString()}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const closeAllDropdowns = (except) => {
    if (except !== 'location') setIsLocationOpen(false);
  };

  const luxuryPropertyData = {
    mainImage: dubai1,
    propertyName: "The Sapphire Residences",
    developer: "Knights Fin",
    price: "₹37 crore",
    galleryImages: [dubai2, dubai3, dubai4],
    onLearnMore: () => {
      navigate('/alba-residences');
    }
  };

  return (
    <div className="hero-section">
      <div className="video-bg">
        <video className="video-content" autoPlay muted loop key={locationData[activeLocation].videoUrl}>
          <source src={locationData[activeLocation].videoUrl} type="video/mp4" />
        </video>
        <div className="video-overlay"></div>
      </div>

      <div className="hero-content">
        <h1 className="hero-title">{locationData[activeLocation].title}</h1>
        <p className="hero-subtitle">{locationData[activeLocation].subtitle}</p>

        <div className="search-container">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by name or location..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />

            <div className="dropdown search-dropdown">
              <button 
                className="btn dropdown-toggle search-btn"
                onClick={() => {
                  closeAllDropdowns('location');
                  setIsLocationOpen(!isLocationOpen);
                }}
              >
                {selectedLocation || 'Location'}
              </button>
              {isLocationOpen && (
                <div className="dropdown-menu show">
                  {locationData[activeLocation].locations.map(loc => (
                    <button
                      key={loc}
                      className="dropdown-item"
                      onClick={() => {
                        setSelectedLocation(loc);
                        setIsLocationOpen(false);
                      }}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button className="btn btn-primary search-submit" onClick={handleSearch}>
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>

        <div className="action-buttons">
          <button 
            className={`btn ${listingType === 'sale' ? 'btn-primary' : 'btn-light'} me-3`}
            onClick={() => handleListingTypeChange('sale')}
          >
            Explore Properties
          </button>
        </div>
      </div>

      <Trusted />
      <Timeless />
      <PartnersSlider />
      <PropertyShowcase 
        activeLocation={activeLocation}
        selectedLocation={selectedLocation}
      />

      <section>
        <LuxuryProperty {...luxuryPropertyData} />
      </section>
      
      <FloatingChat phoneNumber='+917558273523' />
      <About />
      <Testimonials />
      <ContactUs />
      <Footer />
    </div>
  );
};

export default Home;