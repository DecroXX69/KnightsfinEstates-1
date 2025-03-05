// import React from 'react'
// import livingroom from '../assets/livingroom.avif'
// import './Timeless.module.css'

// function Timeless() {
//   return (
//     <div>
//       <h1>Elevating Spaces</h1>
//       <p>We believe that a well designed environment should not only be beautiful but also work effortlessly to support your lifestyle</p>
//       <img src={livingroom} alt="livingroom" />
//     </div>
//   )
// }

// export default Timeless


import React from 'react'
import livingroom from '../assets/livingroom.avif'
import styles from "./Timeless.module.css" // Make sure to create this CSS file

function Timeless() {
  return (
    <div className={styles.timelesscontainer}>
      <div className={styles.imagecontainer}>
        <img src={livingroom} alt="livingroom" />
      </div>
      <div className={styles.contentcontainer}>
        <h1>Elevating Spaces</h1>
        <p>We believe that a well-designed environment should not only be beautiful but also work effortlessly to support your lifestyle.</p>
      </div>
    </div>
  )
}

export default Timeless