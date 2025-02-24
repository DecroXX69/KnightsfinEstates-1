import React, { useState } from 'react';
import styles from './Testimonials.module.css';
import james from '../assets/james.jpg';
import download from '../assets/download.jpg';
import sarah from '../assets/sarah.jpg';

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    {
      text: "KnightsfinEstates exceeded my expectations in every way. Their deep knowledge of the Dubai property market, combined with their unwavering commitment to finding the perfect home for my family, made the entire process seamless and enjoyable. I wholeheartedly recommend KnightsfinEstates to anyone seeking a truly exceptional real estate experience in Dubai.",
      name: "MR. RAJESH KUMAR",
      position: "CEO At DigiMagar Swap, Mumbai",
      image: download
    },
    {
      text: "Working with KnightsfinEstates was an outstanding experience. Their expertise in Dubai's luxury real estate market and attention to detail made our property search efficient and successful. The team's professionalism and dedication to client satisfaction are truly commendable.",
      name: "MS. SARAH ANDERSON",
      position: "Managing Director, London Finance Group",
      image: sarah
    },
    {
      text: "As an international investor, I needed a trustworthy partner in Dubai's real estate market. KnightsfinEstates provided exceptional service, offering valuable insights and guidance throughout the investment process. Their market knowledge and professional approach made the entire experience smooth and rewarding.",
      name: "MR. JAMES WILSON",
      position: "Investment Director, Singapore",
      image: james
    }
  ];

  return (
    <section className={styles.testimonialsSection}>
      <div className="container">
        <h2 className={styles.mainTitle}>
          Hear From Our <span className={styles.highlight}>Happy Clients</span>
        </h2>
        <p className={styles.subtitle}>
          Discover what our clients are saying about their experiences with KnightsfinEstates
        </p>

        <div className={styles.testimonialContainer}>
          <div className={styles.quoteIcon}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="#FFA500">
              <path d="M9.5,3C7.56,3 5.85,3.88 4.79,5.28C3.8,6.57 3.25,8.22 3.25,10.03C3.25,13.84 6.22,16.87 9.89,16.87C10.01,16.87 10.13,16.87 10.25,16.86C9.73,17.86 8.97,18.69 8.07,19.26C7.27,19.76 6.43,20.04 5.63,20.25C5.53,20.28 5.43,20.31 5.33,20.34C5.23,20.37 5.14,20.4 5.04,20.43L4.87,20.5L4.96,20.84L5.12,21.5L5.18,21.72C5.19,21.78 5.22,21.88 5.27,21.91C5.32,21.95 5.38,21.96 5.44,21.94L5.52,21.92L5.66,21.86C6.34,21.59 7.07,21.26 7.77,20.86C9.37,19.92 10.8,18.58 11.91,17C13.13,15.27 13.91,13.32 14.08,11.44C14.12,11.03 14.14,10.62 14.14,10.22C14.14,6.12 12.13,3 9.5,3M19.5,3C17.56,3 15.85,3.88 14.79,5.28C13.8,6.57 13.25,8.22 13.25,10.03C13.25,13.84 16.22,16.87 19.89,16.87C20.01,16.87 20.13,16.87 20.25,16.86C19.73,17.86 18.97,18.69 18.07,19.26C17.27,19.76 16.43,20.04 15.63,20.25C15.53,20.28 15.43,20.31 15.33,20.34C15.23,20.37 15.14,20.4 15.04,20.43L14.87,20.5L14.96,20.84L15.12,21.5L15.18,21.72C15.19,21.78 15.22,21.88 15.27,21.91C15.32,21.95 15.38,21.96 15.44,21.94L15.52,21.92L15.66,21.86C16.34,21.59 17.07,21.26 17.77,20.86C19.37,19.92 20.8,18.58 21.91,17C23.13,15.27 23.91,13.32 24.08,11.44C24.12,11.03 24.14,10.62 24.14,10.22C24.14,6.12 22.13,3 19.5,3Z" />
            </svg>
          </div>

          <div className={styles.testimonialContent}>
            <p className={styles.testimonialText}>
              {testimonials[activeIndex].text}
            </p>

            <div className={styles.testimonialAuthor}>
              <div className={styles.authorImage}>
                <img 
                  src={testimonials[activeIndex].image} 
                  alt={testimonials[activeIndex].name}
                />
              </div>
              <div className={styles.authorInfo}>
                <h4 className={styles.authorName}>{testimonials[activeIndex].name}</h4>
                <p className={styles.authorPosition}>{testimonials[activeIndex].position}</p>
              </div>
            </div>
          </div>

          <div className={styles.testimonialNav}>
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`${styles.navDot} ${activeIndex === index ? styles.active : ''}`}
                onClick={() => setActiveIndex(index)}
                aria-label={`Testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;