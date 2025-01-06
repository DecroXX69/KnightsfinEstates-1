import React, { useState } from 'react';
import ceoImage from '../assets/ceo.jpg';
import mdImage from '../assets/md.jpg';

const Info = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const teamMembers = [
    {
      id: 1,
      name: "Rochak Sahu",
      position: "CEO & Co-Founder",
      description: "Established in the year 2012, Knights Fin Estates believes in building a legacy of wealth that lasts for generations and beyond boundaries. This approach helped us expand our presence in more than 6 countries. But, for us, it is more important that besides our strong financial performance, global presence, much-loved real estate services, we remain a good company that always puts customers at the forefront. At the heart of all of this is our people.",
      italicText: "With 12 years of experience in real estate, Rochak leads the company with a focus on innovation and client satisfaction. His expertise and dedication to excellence have driven the company's growth, helping clients turn their property dreams into reality with seamless service and lasting relationships.",
      image: ceoImage  // Add the image path here
    },
    {
      id: 2,
      name: "Jasbier Singh Sachdev",
      position: "Managing Director",
      description: "Established in the year 2012, Knights Fin Estates believes in building a legacy of wealth that lasts for generations and beyond boundaries. This approach helped us expand our presence in more than 6 countries. But, for us, it is more important that besides our strong financial performance, global presence, much-loved real estate services, we remain a good company that always puts customers at the forefront. At the heart of all of this is our people.",
      italicText: "With a strong commitment to quality and innovation, our goal is simple – helping you find a place you can truly call home, ensuring every step of your real estate journey is effortless and rewarding.",
      image: mdImage  // Add the image path here
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % teamMembers.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + teamMembers.length) % teamMembers.length);
  };

  return (
    <div className="container-fluid bg-white py-5">
      <div className="row align-items-center">
        <div className="col-12 mb-4">
          <h1 className="text-4xl font-bold text-blue-900">
          <span className='text-gold-500'>Knights Fin Estates</span> : Turning Dreams into Homes
            <span className="text-gold-500">.</span>
          </h1>
        </div>
        
        <div className="col-12">
          <div className="description">
            <div className="col-md-6">
              <div className="placeholder-image bg-gray-100 rounded-lg" style={{ height: '500px' }}>
                {/* Dynamically render the team member's image */}
                <img
                  src={teamMembers[currentSlide].image}
                  alt={`${teamMembers[currentSlide].name} - Team Member`}
                  className="w-full h-full object-cover rounded-lg"
                  style={{ height: '530px', width: '480px', borderRadius: '20px' }}
                />
              </div>
            </div>
            
            
            
              <div className="p-4" styles = "text-align: left;">
                <p className="text-gray-600 mb-4">
                  <span className='desc-black'>{teamMembers[currentSlide].description}</span>
                </p>
                
                <p className="text-gray-600 italic mb-4">
                  {teamMembers[currentSlide].italicText}
                </p>
                
                <h2 className="text-2xl font-bold text-blue-900 mb-2">
                  {teamMembers[currentSlide].name}
                </h2>
                
                <p className="text-gray-500">
                  <span className='text-gold-500'>{teamMembers[currentSlide].position}</span>
                </p>
                
                <div className="mt-4 flex gap-2">
                  <button 
                    onClick={prevSlide}
                    className="border border-gray-300 rounded-lg p-2 hover:bg-gray-100 left-btn"
                  >
                    ←
                  </button>
                  <button 
                    onClick={nextSlide}
                    className="border border-gray-300 rounded-lg p-2 hover:bg-gray-100 right-btn"
                  >
                    →
                  </button>
                </div>
                
                <div className="mt-4 flex gap-2">
                  <span className={`h-1 w-12 rounded ${currentSlide === 0 ? 'bg-orange-500' : 'bg-gray-200'}`}></span>
                  <span className={`h-1 w-12 rounded ${currentSlide === 1 ? 'bg-orange-500' : 'bg-gray-200'}`}></span>
                </div>
              </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Info;
