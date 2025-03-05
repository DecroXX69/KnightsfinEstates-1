
import { useState } from 'react';
import { BsTelephone } from 'react-icons/bs';
import { MdEmail } from 'react-icons/md';
import hero from "../assets/About-us-hero.jpg"; 
import axios from 'axios';
import styles from './ContactUsPage.module.css';
import Footer from '../components/Footer';
import PartnersSlider from '../minicomponents/PartnerSlider';
import Navbar from './Navbar';
import MapComponent from './MapComponent';


const ContactUsPage = () => {
  
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Add the missing required fields
    const completeFormData = {
      ...formData,
      chooseProperty: 'Apartment', // Default value
      profession: 'Other' // Default value
    };
  
    try {
      const response = await axios.post('https://knightsfinestates-backend-1.onrender.com/api/contactus', completeFormData);
  
      if (response.status === 201) {
        alert('Message sent successfully!');
        // Clear form
        setFormData({
          fullname: '',
          email: '',
          phone: '',
          message: ''
        });
      }
    } catch (error) {
      console.error('Error submitting the form:', error);
      alert('Error submitting the form. Please try again later.');
    }
  };
  

  return (
    
   
    <div className={styles.contactUsPage}>
      
      
      {/* Hero Section */}
      <div className={styles.aboutUsHero}>
        <img
          src={hero}
          alt="About Us Hero"
          className={styles.heroImage}
        />
        <div className={styles.navbarOverlay}>
          <Navbar />
        </div>
        <div className={styles.heroOverlay}>
          <h1>Contact Us</h1>
        </div>
      </div>
      
      

      {/* Contact Info and Map Section */}
      <div className={styles.contactSection}>
        <div className={styles.container}>
          {/* Contact Info Side */}
          <div className={styles.contactInfo}>
            <h1> We're always happy to <br/>
            serve you!</h1>
            <p>Would you like to speak to us? We're Listening. <br></br>We are just a call or message away!</p>
            
            <div className={styles.contactDetails}>
              <div className={styles.contactItem}>
              <div className={styles.iconWrapper}>
                <BsTelephone size={24} />
              </div>
              <div className={styles.textContent}>
                <p>Request a call back</p>
                <h3>+918177083523</h3>
              </div>
              </div>
              
              <div className={styles.contactItem}>
              <div className={styles.iconWrapper}>
                  <MdEmail size={24} />
               </div>
               <div className={styles.textContent}>
                 <p>Email Us</p>
                 <h3>team@knightsfinestates.com</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Map Side */}
          <div className={styles.mapContainer}>
                      {/* <iframe
                          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3781.8020104941874!2d73.77111131744384!3d18.564256599999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bfffda1390d5%3A0xe9942f5eb5f7a78d!2sTecMetaverse!5e0!3m2!1sen!2sin!4v1697654321000!5m2!1sen!2sin"
                          width="100%"
                          height="100%"
                          style={{ border: 0, borderRadius: '8px' }}
                          allowFullScreen=""
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          title="Office Location"
                      /> */}

<MapComponent />

                      
                      
                  </div>
        </div>
      </div>

      {/* Form Section */}
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit} className={styles.contactForm}>
          {/* ... rest of the form code remains the same ... */}
          <div className={styles.topFormRow}>
          <div className={styles.formGroup}>
            <label>Full Name</label>
            <div className={styles.inputWithIcon}>
            <span className={styles.inputIcon}>👤</span>

            <input
              type="text"
              placeholder="Your Name"
              value={formData.fullname}
              onChange={(e) => setFormData({...formData, fullname: e.target.value})}
            />
          </div>
          </div>
         

            <div className={styles.formGroup}>
              <label>Email Address<span className={styles.required}>*</span></label>
              <div className={styles.inputWithIcon}>
              <span className={styles.inputIcon}>✉️</span>
              <input
                type="email"
                placeholder="Your email address"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Phone Number<span className={styles.required}>*</span></label>
              <div className={styles.phoneInput}>
              <div className={styles.countryCodeWrapper}>
                <select className={styles.countryCode}>
                  <option value="+91">+91</option>
                </select>
                </div>
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                />
              </div>
            </div>
          </div>

          <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Message</label>
            <textarea
              placeholder="Your message"
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              rows="6"
            />
          </div>
          </div>

          <button type="submit" className={styles.submitButton}>
          <span className={styles.buttonIcon}>📤</span>

            Send Request
          </button>
        </form>
      </div>

<PartnersSlider/>
      <Footer />
    </div>
  );
};

export default ContactUsPage;