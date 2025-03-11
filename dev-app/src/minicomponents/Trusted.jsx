import React from "react";
import bedroom from "../assets/bedroom_img.webp";
import stairs from "../assets/stairs.webp";
import kitchen from "../assets/kitchen.webp";
import styles from "./Trusted.module.css";

function Trusted() {
  return (
    <div className={styles.realEstateSection}>
      <div className={styles.textContent}>
        <h1>TRUSTED REAL ESTATE PARTNER</h1>
        <p className={styles.para}>
          We pride ourselves on delivering exceptional real estate services that
          prioritize client satisfaction and success.
        </p>
      </div>
      <div className={styles.imageGrid}>
        {/* Stairs image on the left, spans two rows */}
        <div className={`${styles.imageItem} ${styles.stairsImage}`}>
          <img src={stairs} alt="Modern staircase" />
        </div>
        {/* Bedroom image on top right */}
        <div className={styles.imageItem}>
          <img src={bedroom} alt="Luxurious bedroom" />
        </div>
        {/* Kitchen image on bottom right */}
        <div className={styles.imageItem}>
          <img src={kitchen} alt="Modern kitchen" />
        </div>
      </div>
    </div>
  );
}

export default Trusted;