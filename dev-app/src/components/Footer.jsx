import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaTwitter, FaPinterest, FaLinkedinIn, 
         FaHome, FaInfoCircle, FaPhone, FaAngleRight, FaMapMarkerAlt, 
         FaEnvelope, FaPhoneAlt } from 'react-icons/fa';
import './Footer.css';

const ModernFooter = () => {
  return (
    <footer className="modern-footer">
      {/* Top Wave SVG */}
      <div className="footer-wave">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="#0d6efd" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      <div className="footer-content">
        <div className="container">
          {/* Main Card Section */}
          <div className="main-card-container">
            <div className="main-card">
              <h2 className="card-title">You need a house</h2>
              <p className="card-description">
                Looking for a place to call home? Our expert team is dedicated to finding 
                the perfect home that matches your needs and budget
              </p>
              <Link to="/contact" className="contact-btn">
                Contact Us
              </Link>
            </div>
          </div>

          {/* Contact Information Cards */}
          <div className="contact-info-container">
            <div className="contact-card">
              <div className="contact-icon">
                <FaPhoneAlt />
              </div>
              <h4>Call Us</h4>
              <a href="tel:+918177083523">+918177083523</a>
              <p>Mon-Fri: 9:00 AM - 6:00 PM</p>
            </div>

            <div className="contact-card">
              <div className="contact-icon">
                <FaMapMarkerAlt />
              </div>
              <h4>Find Us</h4>
              <p>506,5th floor, Pyramid Axis, Behind Croma,
              </p>
              <p>Baner, Pune, Maharashtra, India, 411045</p>
            </div>

            <div className="contact-card">
              <div className="contact-icon">
                <FaEnvelope />
              </div>
              <h4>Email Us</h4>
              <a href="mailto:team@knightsfinestates.com">team@knightsfinestates.com</a>
              <p>24/7 Online Support</p>
            </div>
          </div>

          {/* Links Grid */}
          <div className="footer-links-grid">
            {/* Our Company */}
            <div className="footer-section">
              <h3 className="section-title">Our Company</h3>
              <ul className="link-list">
                <li>
                  <FaAngleRight className="bullet-icon" />
                  <Link to="/properties">Properties</Link>
                </li>
                <li>
                  <FaAngleRight className="bullet-icon" />
                  <Link to="/about">About Us</Link>
                </li>
                <li>
                  <FaAngleRight className="bullet-icon" />
                  <Link to="/contact">Contact Us</Link>
                </li>
              </ul>
            </div>

            {/* Properties */}
            <div className="footer-section">
              <h3 className="section-title">Properties</h3>
              <ul className="link-list">
                <li>
                  <FaAngleRight className="bullet-icon" />
                  <Link to="/properties/sale">Property for Sale</Link>
                </li>
                <li>
                  <FaAngleRight className="bullet-icon" />
                  <Link to="/properties/off-plan">Off Plan Properties</Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div className="footer-section">
              <h3 className="section-title">Legal</h3>
              <ul className="link-list">
                <li>
                  <FaAngleRight className="bullet-icon" />
                  <Link to="/privacy-policy">Privacy Policy</Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Social Links */}
          <div className="social-container">
            <div className="social-links">
              <a href="https://www.facebook.com/profile.php?id=61559868392921" className="social-icon"><FaFacebookF /></a>
              <a href="https://www.instagram.com/knightsfinestates/" className="social-icon"><FaInstagram /></a>
              <a href="https://x.com/EstatesFin16778" className="social-icon"><FaTwitter /></a>
              <a href="https://in.pinterest.com/knightsfinestates/" className="social-icon"><FaPinterest /></a>
              <a href="https://www.linkedin.com/company/knights-fin%C2%A0estates/" className="social-icon"><FaLinkedinIn /></a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="copyright-section">
        <p>©2025 Knightsfin Estates. All Rights Reserved.Knightsfin Estates is a company registered in Dubai, United Arab Emirates</p>
      </div>
    </footer>
  );
};

export default ModernFooter;