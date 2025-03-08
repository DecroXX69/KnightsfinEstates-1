import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Phone, Calculator } from 'lucide-react';
import styles from './Mortgage.module.css';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';
import axios from 'axios';

import MiniContact from './miniContactComponent';
import mortgageImage from '../assets/About-us-hero.jpg';

const Mortgage = () => {

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

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTerm, setLoanTerm] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [downPayment, setDownPayment] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState(null);
  const [totalPayment, setTotalPayment] = useState(null);
  const [totalInterest, setTotalInterest] = useState(null);
  
  const handleGoBack = () => {
    navigate(-1);
  };

  const calculateMortgage = (e) => {
    e.preventDefault();
    
    // Convert string inputs to numbers
    const principal = parseFloat(loanAmount) - parseFloat(downPayment || 0);
    const rate = parseFloat(interestRate) / 100 / 12; // Monthly interest rate
    const time = parseFloat(loanTerm) * 12; // Total number of months
    
    // Calculate monthly payment
    const x = Math.pow(1 + rate, time);
    const monthly = (principal * x * rate) / (x - 1);
    
    // Set calculated values
    setMonthlyPayment(monthly);
    setTotalPayment(monthly * time);
    setTotalInterest((monthly * time) - principal);
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.mortgageContainer}>
      {/* <Navbar /> */}
      
      {/* Mortgage Title Section */}
      <div className="container mt-4">
        <button className={styles.btnBack} onClick={handleGoBack}>
          <ArrowLeft size={20} />
          Back to properties
        </button>
        
        <div className="row mt-3">
          {/* <div className="col-md-8" style={{ textAlign: 'left' }}>
            <h1 className={styles.mortgageTitle}>
              Mortgage Calculator
            </h1>
            <div className={styles.mortgageSubtitle}>
              <span>Our qualified mortgage advisors can give you detailed and honest advice on mortgage products and the application process to make sure you’re looked after every step of the way.</span>
            </div>
          </div> */}
        </div>
      </div>

      {/* Banner Image */}
      <div className="container mt-4">
        <div className={styles.bannerContainer}>
          <img 
            src= {mortgageImage} 
            alt="Mortgage Calculator" 
            className={styles.bannerImage}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/1200x400?text=Mortgage+Calculator";
            }}
          />
          <div className={styles.bannerOverlay}>
            <h2>Calculate Your Monthly Payments</h2>
            <p>Use our mortgage calculator to estimate your monthly installments</p>
          </div>
        </div>
      </div>

      {/* Mortgage Calculator Section */}
      <div className="container mt-5">
        <div className="row">
          {/* Left Column - Mortgage Calculator */}
          <div className="col-lg-8">
            <div className={styles.detailsCard}>
              <h2>
                <Calculator size={24} className={styles.cardIcon} />
                Mortgage Calculator
              </h2>
              
              {/* Form Section */}
              <form onSubmit={calculateMortgage}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-4">
                      <label htmlFor="loanAmount" className="form-label">Property Price <span className={styles.required}>*</span></label>
                      <div className={styles.inputWithIcon}>
                        <input
                          type="number"
                          className="form-control"
                          id="loanAmount"
                          placeholder="Enter property price"
                          value={loanAmount}
                          onChange={(e) => setLoanAmount(e.target.value)}
                          required
                        />
                        <span className={styles.currencySymbol}>{currency}</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-4">
                      <label htmlFor="downPayment" className="form-label">Down Payment <span className={styles.required}>*</span></label>
                      <div className={styles.inputWithIcon}>
                        <input
                          type="number"
                          className="form-control"
                          id="downPayment"
                          placeholder="Enter down payment"
                          value={downPayment}
                          onChange={(e) => setDownPayment(e.target.value)}
                          required
                        />
                        <span className={styles.currencySymbol}>{currency}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-4">
                    <div className="mb-4">
                      <label htmlFor="interestRate" className="form-label">Interest Rate <span className={styles.required}>*</span></label>
                      <div className={styles.inputWithIcon}>
                        <input
                          type="number"
                          step="0.01"
                          className="form-control"
                          id="interestRate"
                          placeholder="Ex: 3.5"
                          value={interestRate}
                          onChange={(e) => setInterestRate(e.target.value)}
                          required
                        />
                        <span className={styles.currencySymbol}>%</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-4">
                      <label htmlFor="loanTerm" className="form-label">Loan Term <span className={styles.required}>*</span></label>
                      <div className={styles.inputWithIcon}>
                        <input
                          type="number"
                          className="form-control"
                          id="loanTerm"
                          placeholder="Ex: 25"
                          value={loanTerm}
                          onChange={(e) => setLoanTerm(e.target.value)}
                          required
                        />
                        <span className={styles.currencySymbol}>Years</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-4">
                      <label htmlFor="currency" className="form-label">Currency</label>
                      <select
                        className="form-control form-select"
                        id="currency"
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                      >
                        <option value="INR">INR</option>
                        <option value="AED">AED</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        
                      </select>
                    </div>
                  </div>
                </div>
                
                <button type="submit" className={styles.btnCalculate}>
                  Calculate
                </button>
              </form>

              {/* Results Section */}
              {monthlyPayment && (
                <div className={styles.resultsContainer}>
                  <h3>Mortgage Results</h3>
                  <div className="row">
                    <div className="col-md-4">
                      <div className={styles.resultItem}>
                        <div className={styles.resultLabel}>Monthly Payment</div>
                        <div className={styles.resultValue}>
                          {currency} {monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className={styles.resultItem}>
                        <div className={styles.resultLabel}>Total Payment</div>
                        <div className={styles.resultValue}>
                          {currency} {totalPayment.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className={styles.resultItem}>
                        <div className={styles.resultLabel}>Total Interest</div>
                        <div className={styles.resultValue}>
                          {currency} {totalInterest.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* Form Section */}
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit} className={styles.contactForm}>
          {/* ... rest of the form code remains the same ... */}
          <div className={styles.topFormRow}>
          <div className={styles.formGroup}>
            <label>Full Name</label>
            <div className={styles.inputWithIcon1}>
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
              <div className={styles.inputWithIcon1}>
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
          </div>

          {/* Right Column - Information Card */}
          <div className="col-lg-4">
            <div className={styles.contactCard}>
              <h2>Mortgage Information</h2>
              <div className={styles.infoContent}>
                <h5>What affects your mortgage?</h5>
                <ul className={styles.infoList}>
                  <li>
                    <div className={styles.infoIcon}><i className="bi bi-cash"></i></div>
                    <div className={styles.infoText}>
                      <strong>Interest Rate:</strong> Higher rates mean higher monthly payments.
                    </div>
                  </li>
                  <li>
                    <div className={styles.infoIcon}><i className="bi bi-calendar"></i></div>
                    <div className={styles.infoText}>
                      <strong>Loan Term:</strong> Longer terms reduce monthly payments but increase total interest.
                    </div>
                  </li>
                  <li>
                    <div className={styles.infoIcon}><i className="bi bi-house-door"></i></div>
                    <div className={styles.infoText}>
                      <strong>Down Payment:</strong> Larger down payments reduce your loan amount and monthly payments.
                    </div>
                  </li>
                  <li>
                    <div className={styles.infoIcon}><i className="bi bi-credit-card"></i></div>
                    <div className={styles.infoText}>
                      <strong>Credit Score:</strong> Better credit scores usually qualify for lower interest rates.
                    </div>
                  </li>
                </ul>
                <p className={styles.disclaimer}>
                  This calculator provides an estimate. Actual mortgage terms may vary based on lender criteria and your personal financial situation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mini Contact Component at the bottom */}
      <div className="container mt-5 mb-5">
        <MiniContact />
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Mortgage;