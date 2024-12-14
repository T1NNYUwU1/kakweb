import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const ImageCarousel = ({ images }) => {
  const [currentImage, setCurrentImage] = useState(0);

  return (
    <div className="relative mb-8">
      <img 
        src={images[currentImage]} 
        alt="Project" 
        className="w-full rounded-lg"
      />
      <div className="flex justify-center gap-2 mt-4">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`w-2 h-2 rounded-full ${
              currentImage === index ? 'bg-orange-500' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
      <button 
        onClick={() => setCurrentImage(prev => prev > 0 ? prev - 1 : images.length - 1)}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-1"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button 
        onClick={() => setCurrentImage(prev => prev < images.length - 1 ? prev + 1 : 0)}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-1"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
};
