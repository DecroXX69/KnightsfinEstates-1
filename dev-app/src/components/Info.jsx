import React, { useState } from "react";
import ceoImage from "../assets/ceo.webp";
import mdImage from "../assets/md.webp";
import mgImage from "../assets/manager-img.webp";
import styles from "./Info.module.css";

const Info = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const teamMembers = [
    {
      id: 1,
      name: "Rochak Sahu",
      position: "Founder",
      description: (
        <>
          <span className={styles.establishedText}>Established in 2024</span>,{" "}
          <span className={styles.companyName}>Knights Fin Estates</span> builds lasting wealth legacies across 6 countries. Beyond strong financials, our focus is on exceptional customer service and innovative real estate solutions.
        </>
      ),
      italicText:
        "12+ years in real estate. Leading with innovation and client trust, transforming property dreams into reality.",
      image: ceoImage,
    },
    {
      id: 2,
      name: "Danish Khan",
      position: "Managing Director",
      description: (
        <>
          <span className={styles.establishedText}>Since 2024</span>,{" "}
          <span className={styles.companyName}>Knights Fin Estates</span> creates generational wealth through global expansion. Our priority: customers first. Quality and innovation drive our vision of effortless, rewarding journeys.
        </>
      ),
      italicText:
        "Committed to quality. Simplifying real estate to help you find a cherished home.",
      image: mdImage,
    },
    {
      id: 3,
      name: "Krishnakant Yadav",
      position: "General Manager",
      description: (
        <>
          <span className={styles.establishedText}>Established in 2024</span>,{" "}
          <span className={styles.companyName}>Knights Fin Estates</span> we ensure excellence through innovation, customer service, and strategic growth—building lasting wealth legacies and delivering innovative real estate solutions across six countries.
        </>
      ),
      italicText:
        "Dedicated to real estate excellence, delivering innovative solutions and building lasting client relationships with trust and strategy",
      image: mgImage,
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % teamMembers.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + teamMembers.length) % teamMembers.length);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.mainTitle}>
          <span className={styles.accent}>Knights Fin Estates:</span>
          Turning Dreams into Homes.
        </h1>
      </div>

      <div className={styles.carousel}>
        <div className={styles.imageContainer}>
          
          <img
            src={teamMembers[currentSlide].image}
            alt={teamMembers[currentSlide].name}
            className={styles.memberImage}
          />
        </div>

        <div className={styles.content}>
          <div className={styles.textBlock}>
            <p className={styles.description}>
              {teamMembers[currentSlide].description}
            </p>
            <p className={styles.quote}>
              {teamMembers[currentSlide].italicText}
            </p>
          </div>

          <div className={styles.details}>
            <h2 className={styles.name}>
              {teamMembers[currentSlide].name}
            </h2>
            <span className={styles.position}>
              {teamMembers[currentSlide].position}
            </span>
          </div>

          <div className={styles.controls}>
            <button onClick={prevSlide} className={styles.prevButton}>
              <svg
                className={styles.icon}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />
              </svg>
              Previous
            </button>

            <button onClick={nextSlide} className={styles.nextButton}>
              Next
              <svg
                className={styles.icon}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
              </svg>
            </button>
          </div>

          <div className={styles.indicators}>
            {teamMembers.map((_, index) => (
              <div
                key={index}
                className={`${styles.indicator} ${
                  currentSlide === index ? styles.activeIndicator : ""
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Info;