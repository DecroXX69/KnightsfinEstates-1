import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ContactUs.css';
import indiaIcon from '../assets/india.png';
import axios from 'axios'; // Import Axios

const ContactUs = () => {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
    interested: '',
    message: ''
  });

  const [submissionStatus, setSubmissionStatus] = useState(null); // Tracks submission status


  const handleSubmit = (e) => {
    e.preventDefault();
    try{
        const response =  axios.post('http://localhost:5000/api/contactus',{
            fullname: formData.fullname,
            email: formData.email,
            phone: formData.phone,
            chooseProperty: formData.chooseProperty,
            profession: formData.profession,
            message: formData.message
        });
        //Handle successful response
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
    } catch(error){
        //Handle error
        console.log(error);
        setSubmissionStatus('error');
    }
  };

  return (
    <div className="contact-container">
      <div className="row h-100">
        <div className="col-md-6 contact-info">
          <div className="contact-content">
            <h1 className="main-title" style={{color: (`obj.#febe60`)}}>Looking to buy, sell, or just say hello? Let's talk!</h1>
            <p className="subtitle">
              You're Just a Call or Message Away from Finding a Perfect Home in Dubai.  
              Fill the form to help us know you and your requirements better!
            </p>
            
            <div className="contact-details">
              <div className="contact-item">
                <div className="icon-wrapper">
                  <i className="fas fa-phone"></i>
                </div>
                <div className="info-text">
                  <p>Request a call back</p>
                  <a href="tel:+918177083523" style={{ color:(`obj.#e0e0e0`), textDecoration: 'none' }}>
                  <h3>+91 81770 83523</h3>
                  </a>
                  
                </div>
              </div>
              
              <div className="contact-item">
                <div className="icon-wrapper">
                  <i className="fas fa-envelope"></i>
                </div>
                <div className="info-text">
                  <p>Email us</p>
                  <a href="mailto:team@knightsfinestates.com" style={{ color:(`obj.#e0e0e0`), textDecoration: 'none' }}>
                    <h3>team@knightsfinestates.com</h3>
                    </a>
                  
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="contact-form-wrapper">
            <h1 className="form-title">Contact us</h1>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control1"
                  placeholder="Your Name"
                  value={formData.fullname}
                  onChange={(e) => setFormData({...formData, fullname: e.target.value})}
                />
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    className="form-control1"
                    placeholder="Your email address"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Phone Number *</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <img 
                        src= {indiaIcon}
                        alt="Indian flag" 
                        className="flag-icon"
                      /> +91
                    </span>
                    <input
                      type="tel"
                      className="form-control1"
                      placeholder='Your phone number'
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Kindly choose your property type *</label>
                <select 
                  className="form-select1"
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
  <label className="form-label">Your Profession</label>
  <select
    className="form-select1"
    value={formData.profession}
    onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
  >
    <option value="">Choose Profession</option>
    <option value="Employed">Employed</option>
    <option value="Business">Business</option>
    <option value="Student">Student</option>
    <option value="Other">Other</option>
  </select>
</div>

              <div className="mb-4">
                <label className="form-label">Message</label>
                <textarea
                  className="form-control1"
                  rows="4"
                  placeholder="Your message"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary submit-btn">
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