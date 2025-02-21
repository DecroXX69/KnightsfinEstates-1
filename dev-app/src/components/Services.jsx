import React from 'react';
import styles from './Services.module.css';  
import propertyImg from '../assets/property management.jpg';
import consultImg from '../assets/consulting.jpg';
import consultImg2 from '../assets/consulting2.jpg'

const Services = () => {
  return (
    <div className={`${styles.servicesContainer} container text-center my-5`}>
      <h2 className={styles.servicesHeading}>Services we provide.</h2>
      <p className={`${styles.servicesDescription} mt-3`}>
        Our wide range of services awaits you! No matter where you are in your real estate journey, our services help you navigate the market with ease.
      </p>
      <div className="row mt-5">
        {/* Property Management */}
        <div className="col-md-4 d-flex">
          <div className={`${styles.serviceCard}`}>
            <div className={styles.imageWrapper}>
              <img src={propertyImg} className={styles.cardImage} alt="Property Management" />
            </div>
            <div className={styles.cardBody}>
              <h5 className={styles.serviceTitle}>Property Management</h5>
              <p className={styles.cardText}>
                We help you efficiently manage, maintain, and operate residential or commercial properties on your behalf.
              </p>
            </div>
          </div>
        </div>

        {/* Consulting Services */}
        <div className="col-md-4 d-flex">
          <div className={`${styles.serviceCard}`}>
            <div className={styles.imageWrapper}>
              <img src={consultImg} className={styles.cardImage} alt="Consulting Services" />
            </div>
            <div className={styles.cardBody}>
              <h5 className={styles.serviceTitle}>Consulting <br></br> Services</h5>
              <p className={styles.cardText}>
                We help clients make informed decisions about property investments, development, and management.
              </p>
            </div>
          </div>
        </div>

        {/* Buy and Sell Property */}
        <div className="col-md-4 d-flex">
          <div className={`${styles.serviceCard}`}>
            <div className={styles.imageWrapper}>
              <img src={consultImg2} className={styles.cardImage} alt="Buy and Sell Property" />
            </div>
            <div className={styles.cardBody}>
              <h5 className={styles.serviceTitle}>Buy and Sell Property</h5>
              <p className={styles.cardText}>
                Our dedicated team helps you easily buy or sell your property in Dubai.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
