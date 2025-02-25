import React, { useState } from 'react';
import './Mortgage.module.css'; // Custom CSS for the mortgage page
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MortgagePage = () => {
  const navigate = useNavigate();
  
  // State for form inputs and result
  const [propertyPrice, setPropertyPrice] = useState('');
  const [downPayment, setDownPayment] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [duration, setDuration] = useState('');
  const [currency, setCurrency] = useState('AED');
  const [monthlyPayment, setMonthlyPayment] = useState(null);
  
  // Handle form submission
  const calculateMortgage = (e) => {
    e.preventDefault();
    
    const price = parseFloat(propertyPrice);
    const downPaymentAmount = parseFloat(downPayment);
    const rate = parseFloat(interestRate) / 100 / 12;
    const months = parseFloat(duration) * 12;

    if (price && downPaymentAmount && rate && months) {
      const loanAmount = price - downPaymentAmount;
      const monthly = (loanAmount * rate) / (1 - Math.pow(1 + rate, -months));
      setMonthlyPayment(monthly.toFixed(2));
    } else {
      alert("Please enter valid values.");
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="mortgage-page-container">
      {/* Back Button */}
      <button className="btn-back" onClick={handleGoBack}>
        <ArrowLeft size={20} /> Back to Properties
      </button>
      
      {/* Introduction */}
      <div className="container mt-4">
        <h1 className="mortgage-title">Mortgage Plan</h1>
        <p className="mortgage-intro">
          Learn more about our mortgage plans and calculate your monthly payments.
        </p>
        <p className="mortgage-description">
          Whether you're buying your first home or refinancing, we offer flexible mortgage options with competitive rates. 
          Use our calculator to get an estimate of your monthly payments.
        </p>
      </div>

      {/* Mortgage Calculator Form */}
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-6">
            <div className="calculator-card">
              <h2>Mortgage Calculator</h2>
              <form onSubmit={calculateMortgage}>
                <div className="mb-3">
                  <label htmlFor="propertyPrice" className="form-label">Property Price</label>
                  <input
                    type="number"
                    className="form-control"
                    id="propertyPrice"
                    placeholder="Property Price"
                    value={propertyPrice}
                    onChange={(e) => setPropertyPrice(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="downPayment" className="form-label">Down Payment</label>
                  <input
                    type="number"
                    className="form-control"
                    id="downPayment"
                    placeholder="Down Payment"
                    value={downPayment}
                    onChange={(e) => setDownPayment(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="interestRate" className="form-label">Interest Rate (%)</label>
                  <input
                    type="number"
                    className="form-control"
                    id="interestRate"
                    placeholder="Interest Rate"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="duration" className="form-label">Duration (Years)</label>
                  <input
                    type="number"
                    className="form-control"
                    id="duration"
                    placeholder="Duration in years"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="currency" className="form-label">Currency</label>
                  <select
                    className="form-control"
                    id="currency"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                  >
                    <option value="AED">AED</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-calculate w-100">
                  Calculate
                </button>
              </form>
            </div>
          </div>

          {/* Result Section */}
          <div className="col-md-6">
            <div className="result-card">
              <h2>Monthly Payment</h2>
              {monthlyPayment !== null ? (
                <div className="result">
                  <h3>{currency} {monthlyPayment}</h3>
                  <p>Estimated monthly payment based on your inputs.</p>
                </div>
              ) : (
                <p>Enter details in the form to calculate your monthly mortgage payment.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MortgagePage;
