import React, { useState, useEffect } from 'react';
import banner1 from '../assets/Banner1.jpeg';
import banner3 from '../assets/Banner3.jpeg';
import banner4 from '../assets/Banner4.jpeg';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';

const BannerSlider = ({ images }) => {
  const defaultBanners = [
    { id: 1, img: banner1 },
    { id: 4, img: banner4 },
    { id: 3, img: banner3 }
  ];

  const banners = images ? images.map((img, i) => ({ id: i, img })) : defaultBanners;

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + banners.length) % banners.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000); // Auto scroll every 5 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="relative w-full h-[300px] md:h-[450px] overflow-hidden rounded-3xl shadow-xl group max-w-7xl mx-auto">
        {/* Slides */}
        <div 
          className="w-full h-full flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {banners.map((banner) => (
            <div key={banner.id} className="w-full h-full flex-shrink-0">
              <img 
                src={banner.img} 
                alt="Promotion Banner" 
                className="w-full h-full object-cover object-center"
              />
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button 
          onClick={prevSlide}
          className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/40 hover:bg-white/80 p-2 md:p-3 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 z-10"
        >
          <RiArrowLeftSLine size={24} className="text-gray-900" />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/40 hover:bg-white/80 p-2 md:p-3 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 z-10"
        >
          <RiArrowRightSLine size={24} className="text-gray-900" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${currentIndex === index ? 'bg-red-500 w-6' : 'bg-white/50'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BannerSlider;
