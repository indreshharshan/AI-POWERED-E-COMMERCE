import exclusive_image from "../assets/exclusive_image.png";
import { Link } from 'react-router-dom';

const Offers = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-gradient-to-b from-pink-400/30 to-white rounded-xl overflow-hidden shadow-lg max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center">
          {/* Left Content */}
          <div className="flex-1 p-6 md:ml-20 sm:p-8">
            <h2 className="text-3xl sm:text-5xl font-bold text-black mb-3 drop-shadow-sm">
              <span className="block mb-5">Exclusive</span>
              <span className="block">Offers For You</span>
            </h2>

            <p className="text-black text-base mb-6 tracking-wide font-bold">
              ONLY ON BEST SELLERS PRODUCTS
            </p>

            <Link to = "/mens"
              className="inline-flex items-center px-6 py-2.5 text-base font-semibold text-white cursor-pointer
              bg-red-500 rounded-full w-fit transform transition-all duration-300 
              hover:bg-red-600 hover:scale-105 hover:shadow-lg
              focus:outline-none focus:ring-2 focus:ring-red focus:ring-offset-1 focus:ring-offset-red-500"
            >
              Check Now
            </Link>
          </div>

          {/* Right Image */}
          <div className="flex-1 relative p-4 md:p-6">
            <div className="relative group">
              {/* Background glow effect */}
              <div
                className="absolute -inset-2 bg-white/20 rounded-full blur-xl 
                transform group-hover:scale-105 transition-transform duration-500"
              ></div>

              {/* Image with animation */}
              <div className="relative">
                <img
                  src={exclusive_image}
                  alt="Exclusive Offer"
                  className="w-full h-auto max-w-[280px] mx-auto transform 
                    group-hover:scale-105 transition-transform duration-500
                    drop-shadow-xl hover:drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Offers;
