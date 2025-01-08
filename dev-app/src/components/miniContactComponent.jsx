import React from 'react';
import { Phone } from 'lucide-react';

const MiniContactComponent = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-8">
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-blue-800 mb-4">
            Your search for dream home and lucrative investment opportunities ends here!
          </h2>
          <p className="text-gray-600 mb-6">
            Get in touch with our expert team. We're dedicated to helping you through each phase of your real estate journey
          </p>
          <button className="bg-orange-500 text-white px-6 py-3 rounded-lg flex items-center gap-2">
            <Phone size={20} />
            Contact Us
          </button>
        </div>
        <div className="flex-1">
          <img 
            src="/api/placeholder/600/400" 
            alt="Handshake" 
            className="w-full rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default MiniContactComponent;