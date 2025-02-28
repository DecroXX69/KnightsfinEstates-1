import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AboutUs from './AboutUs';
import FloatingChat from '../services/FloatingChat';
import { 
  ChevronDown, 
  Home as HomeIcon,
  Landmark as CastleIcon,
  Building as BuildingIcon,
  Hotel as PenthouseIcon, 
  Contact
} from 'lucide-react';
import './Home.css';
import dubai from '../videos/dubai.mp4';
import thailand from '../videos/thailand.mp4';
import logo from '../assets/logo12.png';
import PropertyShowcase from './PropertyShowcase';
import LuxuryProperty from '../minicomponents/LuxuryProperty';
import PartnersSlider from '../minicomponents/PartnerSlider';
import dubai1 from '../assets/dubai1.jpg';
import dubai2 from '../assets/dubai2.jpg';
import dubai3 from '../assets/dubai3.jpg';
import dubai4 from '../assets/dubai4.jpg';
import About from '../minicomponents/About';
import Testimonials from './Testimonials';
import Footer from './Footer';
import ContactUs from './ContactUs';
import Navbar from './Navbar';


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
    locations: ["Wakad", "Baner", "Downtown Dubai", "Arabian Ranches", "Dubai Hills"],
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

const propertyTypes = [
  { name: "Villa", icon: CastleIcon },
  { name: "Townhouse", icon: HomeIcon },
  { name: "Penthouse", icon: PenthouseIcon },
  { name: "Apartment", icon: BuildingIcon }
];

const bedroomOptions = ["Studio", "1", "1.5", "2", "3", "4", "5", "6"];

const Home = () => {
  const navigate = useNavigate();
  const [activeLocation, setActiveLocation] = useState('Pune');
  const [listingType, setListingType] = useState('sale');
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [isPropertyTypeOpen, setIsPropertyTypeOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isBedroomOpen, setIsBedroomOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPropertyType, setSelectedPropertyType] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedBedroom, setSelectedBedroom] = useState('');

  const handleListingTypeChange = (type) => {
    setListingType(type);
  };

  // Home.jsx
const handleSearch = () => {
  navigate('/propertylisting', {
    state: {
      listingType: listingType,
      location: activeLocation, // country
      query: selectedLocation || searchQuery, // area or free-text search
      propertyType: selectedPropertyType,
      beds: selectedBedroom,
    }
  });
};

  const closeAllDropdowns = (except) => {
    if (except !== 'explore') setIsExploreOpen(false);
    if (except !== 'propertyType') setIsPropertyTypeOpen(false);
    if (except !== 'location') setIsLocationOpen(false);
    if (except !== 'bedroom') setIsBedroomOpen(false);
  };

  const luxuryPropertyData = {
    mainImage: dubai1,
    propertyName: "The Alba Residences",
    developer: "Omniyat",
    price: "AED 43 M",
    galleryImages: [dubai2, dubai3, dubai4],
    onLearnMore: () => {
      navigate('/alba-residences');
    }
  };

  return (
    <div className="hero-section">
      {/* Video Background */}
      <div className="video-bg">
        <video className="video-content" autoPlay muted loop key={locationData[activeLocation].videoUrl}>
          <source src={locationData[activeLocation].videoUrl} type="video/mp4" />
        </video>
        <div className="video-overlay"></div>
      </div>

      <Navbar/>

      <div className="hero-content">
        {/* Location Buttons */}
        {/* <div className="location-buttons mb-4">
          {Object.keys(locationData).map(location => (
            <button
              key={location}
              className={`btn location-btn ${activeLocation === location ? 'btn-active' : 'btn-inactive'}`}
              onClick={() => setActiveLocation(location)}
            >
              <span className="location-flag">{locationData[location].flag}</span>
              <span className="location-initials">{locationData[location].initials}</span>
            </button>
          ))}
        </div> */}

        <h1 className="hero-title">{locationData[activeLocation].title}</h1>
        <p className="hero-subtitle">{locationData[activeLocation].subtitle}</p>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button 
            className={`btn ${listingType === 'sale' ? 'btn-primary' : 'btn-light'} me-3`}
            onClick={() => handleListingTypeChange('sale')}
          >
            Buy
          </button>
          <button 
            className={`btn ${listingType === 'offplan' ? 'btn-primary' : 'btn-light'}`}
            onClick={() => handleListingTypeChange('offplan')}
          >
            Off Plan
          </button>
        </div>

        {/* Search Bar */}
        <div className="search-container">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClick={() => closeAllDropdowns()}
            />
            
            {/* Property Type Dropdown */}
            <div className="dropdown search-dropdown">
              <button 
                className="btn dropdown-toggle search-btn"
                onClick={() => {
                  closeAllDropdowns('propertyType');
                  setIsPropertyTypeOpen(!isPropertyTypeOpen);
                }}
              >
                {selectedPropertyType || 'Property Type'}
              </button>
              {isPropertyTypeOpen && (
                <div className="dropdown-menu show">
                  {propertyTypes.map(type => (
                    <button
                      key={type.name}
                      className="dropdown-item"
                      onClick={() => {
                        setSelectedPropertyType(type.name);
                        setIsPropertyTypeOpen(false);
                      }}
                    >
                      {type.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Location Dropdown */}
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

            {/* Bedrooms Dropdown */}
            <div className="dropdown search-dropdown">
              <button 
                className="btn dropdown-toggle search-btn"
                onClick={() => {
                  closeAllDropdowns('bedroom');
                  setIsBedroomOpen(!isBedroomOpen);
                }}
              >
                {selectedBedroom || 'Bedrooms'}
              </button>
              {isBedroomOpen && (
                <div className="dropdown-menu show">
                  {bedroomOptions.map(bed => (
                    <button
                      key={bed}
                      className="dropdown-item"
                      onClick={() => {
                        setSelectedBedroom(bed);
                        setIsBedroomOpen(false);
                      }}
                    >
                      {bed}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button 
              className="btn btn-primary search-submit"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </div>

        {/* Property Type Icons */}
        <div className="property-icons">
          {propertyTypes.map(({ name, icon: Icon }) => (
            <div key={name} className="property-icon-item">
              <div className="icon-label-container">
                <Icon size={16} className="property-icon" />
                <span className="property-label">{name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <PropertyShowcase 
        activeLocation={activeLocation}
        selectedLocation={selectedLocation}
      />

      {/* <button className="btn btn-primary btn-lg" id='loadbtn'>Load More</button> */}

      <section>
        <LuxuryProperty {...luxuryPropertyData} />
      </section>
      
      <FloatingChat phoneNumber='+917558273523'/>
      <About />
      <PartnersSlider />
      <Testimonials />
      <ContactUs />
      <Footer />
    </div>
  );
};

export default Home;