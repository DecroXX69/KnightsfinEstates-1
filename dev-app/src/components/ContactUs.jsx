import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './ContactUs.module.css';
import indiaIcon from '../assets/india.png';
import axios from 'axios';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
    chooseProperty: '',
    profession: '',
    message: ''
  });

  const [submissionStatus, setSubmissionStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://knightsfinestates-backend-1.onrender.com/api/contactus', formData);
      console.log(response.data);
      setSubmissionStatus('success');
      setFormData({
        fullname: '',
        email: '',
        phone: '',
        chooseProperty: '',
        profession: '',
        message: ''
      });
    } catch (error) {
      console.log(error);
      setSubmissionStatus('error');
    }
  };

  return (
    <div className={styles.contactContainer}>
      <div className="row h-100">
        <div className={`col-md-6 ${styles.contactInfo}`}>
          <div className={styles.contactContent}>
            <h1 className={styles.mainTitle}>
              Looking to buy, sell, or just say hello? Let's talk!
            </h1>
            <p className={styles.subtitle}>
              You're Just a Call or Message Away from Finding a Perfect Home in Dubai.
              Fill the form to help us know you and your requirements better!
            </p>
            
            <div className={styles.contactDetails}>
              <div className={styles.contactItem}>
                <div className={styles.iconWrapper}>
                  <i className="fas fa-phone"></i>
                </div>
                <div className={styles.infoText}>
                  <p>Request a call back</p>
                  <a href="tel:+917558273523" style={{ color: '#e0e0e0', textDecoration: 'none' }}>
                    <h3>+917558273523</h3>
                  </a>
                </div>
              </div>
              
              <div className={styles.contactItem}>
                <div className={styles.iconWrapper}>
                  <i className="fas fa-envelope"></i>
                </div>
                <div className={styles.infoText}>
                  <p>Email us</p>
                  <a href="mailto:team@knightsfinestates.com" style={{ color: '#e0e0e0', textDecoration: 'none' }}>
                    <h3>team@knightsfinestates.com</h3>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className={styles.contactFormWrapper}>
            <h1 className={styles.formTitle}>Contact us</h1>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className={styles.formLabel}>Full Name</label>
                <input
                  type="text"
                  className={`form-control ${styles.formControl}`}
                  placeholder="Your Name"
                  value={formData.fullname}
                  onChange={(e) => setFormData({...formData, fullname: e.target.value})}
                />
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label className={styles.formLabel}>Email Address *</label>
                  <input
                    type="email"
                    className={`form-control ${styles.formControl}`}
                    placeholder="Your email address"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="col-md-6">
                  <label className={styles.formLabel}>Phone Number *</label>
                  <div className="input-group">
                    <span className={`input-group-text ${styles.inputGroupText}`}>
                      <img 
                        src={indiaIcon}
                        alt="Indian flag" 
                        className={styles.flagIcon}
                      /> +91
                    </span>
                    <input
                      type="tel"
                      className={`form-control ${styles.formControl}`}
                      placeholder="Your phone number"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label className={styles.formLabel}>Kindly choose your property type *</label>
                <select 
                  className={`form-select ${styles.formSelect}`}
                  required
                  value={formData.chooseProperty}
                  onChange={(e) => setFormData({...formData, chooseProperty: e.target.value})}
                >
                  <option value="">Choose</option>
                  <option value="Villa">Villa</option>
                  <option value="Townhouse">Townhouse</option>
                  <option value="Penthouse">Penthouse</option>
                  <option value="Apartment">Apartment</option>
                </select>
              </div>

              <div className="mb-3">
                <label className={styles.formLabel}>Your Profession</label>
                <select
                  className={`form-select ${styles.formSelect}`}
                  required
                  value={formData.profession}
                  onChange={(e) => setFormData({...formData, profession: e.target.value})}
                >
                  <option value="">Choose Profession</option>
                  <option value="Employed">Employed</option>
                  <option value="Business">Business</option>
                  <option value="Student">Student</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="mb-4">
                <label className={styles.formLabel}>Message</label>
                <textarea
                  className={`form-control ${styles.formControl}`}
                  rows="4"
                  placeholder="Your message"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>

              <button type="submit" className={`btn ${styles.submitBtn}`}>
                Send Request
              </button>
            </form>
            
            {submissionStatus === 'success' && (
              <div className="alert alert-success mt-3">
                Thank you! Your message has been sent successfully.
              </div>
            )}
            {submissionStatus === 'error' && (
              <div className="alert alert-danger mt-3">
                Oops! Something went wrong. Please try again.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;