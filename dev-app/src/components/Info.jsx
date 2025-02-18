import React, { useState } from "react";
import ceoImage from "../assets/ceo.jpg";
import mdImage from "../assets/md.jpg";

const Info = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const teamMembers = [
    {
      id: 1,
      name: "Rochak Sahu",
      position: "CEO & Co-Founder",
      description: "Established in the year 2012, Knights Fin Estates believes in building a legacy of wealth that lasts for generations and beyond boundaries. This approach helped us expand our presence in more than 6 countries. But, for us, it is more important that besides our strong financial performance, global presence, much-loved real estate services, we remain a good company that always puts customers at the forefront. At the heart of all of this is our people.",
      italicText: "With 12 years of experience in real estate, Rochak leads the company with a focus on innovation and client satisfaction. His expertise and dedication to excellence have driven the company's growth, helping clients turn their property dreams into reality with seamless service and lasting relationships.",
      image: ceoImage,
    },
    {
      id: 2,
      name: "Jasbier Singh Sachdev",
      position: "Managing Director",
      description: "Established in the year 2012, Knights Fin Estates believes in building a legacy of wealth that lasts for generations and beyond boundaries. This approach helped us expand our presence in more than 6 countries. But, for us, it is more important that besides our strong financial performance, global presence, much-loved real estate services, we remain a good company that always puts customers at the forefront. At the heart of all of this is our people.",
      italicText: "With a strong commitment to quality and innovation, our goal is simple – helping you find a place you can truly call home, ensuring every step of your real estate journey is effortless and rewarding.",
      image: mdImage,
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % teamMembers.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + teamMembers.length) % teamMembers.length);
  };

  return (
    <div className="relative bg-white py-10 md:py-16">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        <h1 className="text-4xl font-bold text-blue-900 text-center mb-8 md:text-5xl relative">
          <span className="text-rose-500">
            Knights Fin Estates:
          </span>{" "}
          Turning Dreams into Homes.
          <span className="text-rose-500">&nbsp;.</span>
        </h1>

        <div className="relative md:flex md:items-center md:gap-12">
          {/* Image Container */}
          <div className="md:w-1/2 mb-8 md:mb-0">
            <div className="relative h-full hover:scale-105 transition-transform">
              <img
                src={teamMembers[currentSlide].image}
                alt={teamMembers[currentSlide].name}
                className="w-full h-full object-cover rounded-xl shadow-xl border border-gray-100"
              />
              <div className="absolute inset-0 bg-black/10 backdrop-blur-lg transition-opacity hover:opacity-0 rounded-xl"></div>
            </div>
          </div>

          {/* Content Container */}
          <div className="md:w-1/2 md:pl-8">
            <div className="space-y-6 md:space-y-8">
              <p className="text-gray-700 md:text-lg">
                <span className="text-black font-semibold tracking-wide">
                  {teamMembers[currentSlide].description}
                </span>
              </p>

              <p className="italic text-gray-500 md:text-lg">
                {teamMembers[currentSlide].italicText}
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between mt-8">
              {/* Name & Position */}
              <div className="flex items-center gap-4 md:gap-6">
                <h2 className="text-2xl font-bold text-blue-900">
                  {teamMembers[currentSlide].name}
                </h2>
                <span className="text-rose-500 text-lg">
                  {teamMembers[currentSlide].position}
                </span>
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center gap-4 mt-4 md:mt-0">
                <button
                  onClick={prevSlide}
                  className="p-3 bg-white border border-gray-200 rounded-full shadow-md hover:bg-gray-100 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 text-gray-600 hover:text-blue-900"
                  >
                    <path
                      fillRule="evenodd"
                      d="M15.3 10.3a1 1 0 010 1.414l-5 5c-.39.39-1.17.39-1.56 0v-1.414a3 3 0 00-2.122-1.37l-6 3c-.195.1-.195.57 0 .67l6 3a3 3 0 002.122-1.37v-1.414l-5-5a1 1 0 011.414-1.414L12 12.586l4.293-4.293a1 1 0 011.414 0z"
                    />
                  </svg>
                </button>

                <button
                  onClick={nextSlide}
                  className="p-3 bg-white border border-gray-200 rounded-full shadow-md hover:bg-gray-100 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 text-gray-600 hover:text-blue-900"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.707 10.293a1 1 0 010 1.414L14.414 16a1 1 0 11-1.414 1.414l-5.313-5.313a3 3 0 00-2.122 1.37V17.414a3 3 0 002.122 1.37l6-3c.195-.1.195-.57 0-.67l-6-3a3 3 0 00-2.122 1.37V12.586L8.707 10.293z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Progress Indicators */}
            <div className="flex gap-2 items-center mt-8">
              {teamMembers.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 w-12 rounded-full transition-opacity ${
                    currentSlide === index ? "bg-rose-500" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Info;