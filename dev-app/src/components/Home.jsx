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

// Data imports
import { locationData, propertyTypes, bedroomOptions } from './homeData';

// Asset imports
import styles from './Home.module.css';
import dubai from '../videos/dubai.mp4';
import thailand from '../videos/thailand.mp4';
import dubai1 from '../assets/dubai1.jpg';
import dubai2 from '../assets/dubai2.jpg';
import dubai3 from '../assets/dubai3.jpg';
import dubai4 from '../assets/dubai4.jpg';

// Sub-components
const HeroBackground = ({ videoUrl }) => (
  <div className={styles.videoBg}>
    <video className={styles.videoContent} autoPlay muted loop>
      <source src={videoUrl} type="video/mp4" />
    </video>
    <div className={styles.videoOverlay}></div>
  </div>
);

const HeroContent = ({ 
  locationData, 
  activeLocation, 
  listingType, 
  searchQuery, 
  selectedLocation, 
  selectedPropertyType, 
  selectedBedroom,
  handleListingTypeChange, 
  setSearchQuery, 
  handleSearch 
}) => (
  <div className={styles.heroContent}>
    <h1 className={styles.heroTitle}>{locationData[activeLocation].title}</h1>
    <p className={styles.heroSubtitle}>{locationData[activeLocation].subtitle}</p>

    <SearchBar 
      searchQuery={searchQuery} 
      setSearchQuery={setSearchQuery} 
      handleSearch={handleSearch} 
    />

    <ActionButtons 
      listingType={listingType} 
      handleListingTypeChange={handleListingTypeChange} 
      handleSearch={handleSearch}
    />
  </div>
);

const SearchBar = ({ searchQuery, setSearchQuery, handleSearch }) => (
  <div className={styles.searchContainer}>
    <div className={styles.searchBar}>
      <input
        type="text"
        placeholder="Search..."
        className={styles.searchInput}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button 
        className={`${styles.btn} ${styles.btnPrimary} ${styles.searchSubmit}`} 
        onClick={() => {
          // Direct navigation with location parameter
          if (searchQuery) {
            window.location.href = `/propertylisting?location=${encodeURIComponent(searchQuery)}`;
          }
        }}
      >
        <i className="fas fa-search"></i>
      </button>
    </div>
  </div>
);

const ActionButtons = ({ listingType, handleListingTypeChange, handleSearch }) => (
  <div className={styles.actionButtons}>
    <button 
      className={`${styles.btn} ${listingType === 'sale' ? styles.btnPrimary : styles.btnLight} ${styles.me3}`}
      onClick={() => handleSearch(false)}  // Pass false to indicate this is NOT a location search
    >
      Explore Properties
    </button>
  </div>
);

const Home = () => {
  const navigate = useNavigate();
  const [activeLocation, setActiveLocation] = useState('Pune');
  const [listingType, setListingType] = useState('sale');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPropertyType, setSelectedPropertyType] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedBedroom, setSelectedBedroom] = useState('');

  const handleListingTypeChange = (type) => {
    setListingType(type);
  };

  const handleSearch = () => {
    navigate('/propertylisting', {
      state: {
        listingType: listingType,
        location: activeLocation,
        query: selectedLocation || searchQuery,
        propertyType: selectedPropertyType,
        beds: selectedBedroom,
      }
    });
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
    <div className={styles.heroSection}>
      <HeroBackground videoUrl={locationData[activeLocation].videoUrl} />

      <HeroContent 
        locationData={locationData}
        activeLocation={activeLocation}
        listingType={listingType}
        searchQuery={searchQuery}
        selectedLocation={selectedLocation}
        selectedPropertyType={selectedPropertyType}
        selectedBedroom={selectedBedroom}
        handleListingTypeChange={handleListingTypeChange}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
      />

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