import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaTwitter, FaPinterest, FaLinkedinIn, 
         FaHome, FaInfoCircle, FaPhone, FaAngleRight, FaMapMarkerAlt, 
         FaEnvelope, FaPhoneAlt } from 'react-icons/fa';
import styles from './Footer.module.css';

const ModernFooter = () => {
  return (
    <footer className={styles.modernFooter}>
      {/* Top Wave SVG */}
      <div className={styles.footerWave}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        </svg>
      </div>

      <div className={styles.footerContent}>
        <div className={styles.container}>
          {/* Main Card Section */}
          <div className={styles.mainCardContainer}>
            <div className={styles.mainCard}>
              <h2 className={styles.cardTitle}>You need a house</h2>
              <p className={styles.cardDescription}>
                Looking for a place to call home? Our expert team is dedicated to finding 
                the perfect home that matches your needs and budget
              </p>
              <Link to="/contactuspage" className="contact-btn">
                Contact Us
              </Link>
            </div>
          </div>

          {/* Contact Information Cards */}
          <div className={styles.contactInfoContainer}>
            <div className={styles.contactCard}>
              <div className={styles.contactIcon}>
                <FaPhoneAlt />
              </div>
              <h4>Call Us</h4>
              <a href="tel:+918177083523">+918177083523</a>
              <p>Mon-Fri: 9:00 AM - 6:00 PM</p>
            </div>

            <div className={styles.contactCard}>
              <div className={styles.contactIcon}>
                <FaMapMarkerAlt />
              </div>
              <h4>Find Us</h4>
              <p>506,5th floor, Pyramid Axis, Behind Croma,
              </p>
              <p>Baner, Pune, Maharashtra, India, 411045</p>
            </div>

            <div className={styles.contactCard}>
              <div className={styles.contactIcon}>
                <FaEnvelope />
              </div>
              <h4>Email Us</h4>
              <a href="mailto:team@knightsfinestates.com">team@knightsfinestates.com</a>
              <p>24/7 Online Support</p>
            </div>
          </div>

          {/* Links Grid */}
          <div className={styles.footerLinksGrid}>
            {/* Our Company */}
            <div className={styles.footerSection}>
              <h3 className={styles.sectionTitle}>Our Company</h3>
              <ul className={styles.linkList}>
                <li>
                  <FaAngleRight className={styles.bulletIcon} />
                  <Link to="/properties">Properties</Link>
                </li>
                <li>
                  <FaAngleRight className={styles.bulletIcon} />
                  <Link to="/about">About Us</Link>
                </li>
                <li>
                  <FaAngleRight className="bullet-icon" />
                  <Link to="/contactuspage">Contact Us</Link>
                </li>
              </ul>
            </div>

            {/* Properties */}
            <div className={styles.footerSection}>
              <h3 className={styles.sectionTitle}>Properties</h3>
              <ul className={styles.linkList}>
                <li>
                  <FaAngleRight className={styles.bulletIcon} />
                  <Link to="/properties/sale">Property for Sale</Link>
                </li>
                <li>
                  <FaAngleRight className={styles.bulletIcon} />
                  <Link to="/properties/off-plan">Off Plan Properties</Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div className={styles.footerSection}>
              <h3 className={styles.sectionTitle}>Legal</h3>
              <ul className={styles.linkList}>
                <li>
                  <FaAngleRight className={styles.bulletIcon} />
                  <Link to="/privacy-policy">Privacy Policy</Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Social Links */}
          <div className={styles.socialContainer}>
            <div className={styles.socialLinks}>
              <a href="https://www.facebook.com/profile.php?id=61559868392921" className={styles.socialIcon}><FaFacebookF /></a>
              <a href="https://www.instagram.com/knightsfinestates/" className={styles.socialIcon}><FaInstagram /></a>
              <a href="https://x.com/EstatesFin16778" className={styles.socialIcon}><FaTwitter /></a>
              <a href="https://in.pinterest.com/knightsfinestates/" className={styles.socialIcon}><FaPinterest /></a>
              <a href="https://www.linkedin.com/company/knights-fin%C2%A0estates/" className={styles.socialIcon}><FaLinkedinIn /></a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className={styles.copyrightSection}>
        <p>©2025 Knightsfin Estates. All Rights Reserved. Knightsfin Estates is a company registered in Dubai, United Arab Emirates</p>
      </div>
    </footer>
  );
};

export default ModernFooter;