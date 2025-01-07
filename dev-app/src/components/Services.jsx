// Services.jsx
import React from 'react';
import './Services.css';
import propertyImg from '../assets/property management.jpg';
import consultImg from '../assets/consulting.jpg';
import { FaKey } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { FaHandHoldingDollar } from "react-icons/fa6";

const key = <FaKey size={50} color="#f0c929" />;
const home = <FaHome size={50} color="#f0c929" />;
const hand = <FaHandHoldingDollar size={50} color="#f0c929" />;

const Services = () => {
  return (
    <div className="services-container container text-center my-5">
      <h2 className="services-heading">Services we provide.</h2>
      <p className="services-description mt-3">
        Our wide range of services awaits you! No matter where you are in your real estate journey, our wide range of services help you easily navigate the real estate market.
      </p>
      <div className="row mt-5">
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <div className="service-icon mb-3">
                {key} 
              </div>
              <h5 className="card-title">Property Management</h5>
              <div className='card'>
                <img src={propertyImg} className='card-image' alt="Property Management" />
              </div>
              <p className="card-text">
                We help you efficiently manage, maintain, and operate residential or commercial properties on your behalf.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <div className="service-icon mb-3">
                {home}
              </div>
              <h5 className="card-title">Consulting Services</h5>
              <div className='card'>
                <img src={propertyImg} className='card-image' alt="Consulting Services" />
              </div>
              <p className="card-text">
                We help clients make informed decisions about property investments, development, and management.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <div className="service-icon mb-3">
                {hand}
              </div>
              <h5 className="card-title">Buy and sell property</h5>
              <div className='card'>
                <img src={propertyImg} className='card-image' alt="Buy and sell property" />
              </div>
              <p className="card-text">
                We have a dedicated team working round the clock to help you easily buy or sell your property in Dubai.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
