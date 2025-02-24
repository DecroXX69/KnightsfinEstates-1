import React, { useState } from 'react';
import { FaComments, FaWhatsapp, FaPhone, FaTimes } from 'react-icons/fa';
import styles from './FloatingChat.module.css';

const FloatingChat = ({ phoneNumber = "+917558273523" }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleWhatsAppClick = () => {
    // Format the message and encode it for the URL
    const message = encodeURIComponent("I want to enquiry");
    // Remove any non-numeric characters from phone number
    const formattedNumber = phoneNumber.replace(/\D/g, '');
    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${formattedNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handlePhoneClick = () => {
    window.location.href = `tel:${phoneNumber}`;
  };

  return (
    <div className={styles.floatingChatContainer}>
      {isOpen && (
        <div className={styles.chatOptions}>
          <button 
            onClick={handleWhatsAppClick} 
            className={`${styles.chatOption} ${styles.whatsapp}`}
            title="Chat on WhatsApp"
          >
            <FaWhatsapp />
          </button>
          <button 
            onClick={handlePhoneClick} 
            className={`${styles.chatOption} ${styles.phone}`}
            title="Call us"
          >
            <FaPhone />
          </button>
        </div>
      )}
      <button 
        className={`${styles.chatToggle} ${isOpen ? styles.active : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title={isOpen ? "Close chat options" : "Open chat options"}
      >
        {isOpen ? <FaTimes /> : <FaComments />}
      </button>
    </div>
  );
};

export default FloatingChat;