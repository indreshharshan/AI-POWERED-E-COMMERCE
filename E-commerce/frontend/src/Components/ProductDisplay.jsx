import React, { useContext, useState } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { ShopContext } from "../Context/ShopContext";
import BodyTryOn from "./BodyTryOn";
import { User } from 'lucide-react';

const ProductDisplay = (props) => {
  const { product } = props;
  const { addToCart } = useContext(ShopContext);
  const [selectedSize, setSelectedSize] = useState("");
  const [isBodyTryOnOpen, setIsBodyTryOnOpen] = useState(false);

  const renderRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-500" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-500" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-gray-300" />);
      }
    }

    return stars;
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Left Side: Image Gallery */}
        <div className="flex flex-col-reverse lg:flex-row gap-4 lg:w-1/2">
          {/* Thumbnails */}
          <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-y-auto">
            {[...Array(4)].map((_, index) => (
              <img
                key={index}
                src={product.image}
                alt={product.name}
                className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg cursor-pointer border hover:border-red-500 transition-all"
              />
            ))}
          </div>
          {/* Main Image */}
          <div className="flex-1 relative group">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-auto object-cover rounded-xl shadow-lg"
            />
            <button 
                onClick={() => setIsBodyTryOnOpen(true)}
                className="absolute bottom-6 right-6 bg-red-500 text-white px-6 py-3 rounded-full 
                font-bold text-xs uppercase tracking-widest shadow-2xl flex items-center gap-2 
                hover:bg-black transition-all duration-300 scale-0 group-hover:scale-100"
            >
                <User className="w-4 h-4" />
                Try On Live
            </button>
          </div>
        </div>

        {/* Right Side: Product Details */}
        <div className="lg:w-1/2 space-y-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 tracking-tight">
            {product.name}
          </h1>

          <div className="flex items-center gap-2">
            <div className="flex">{renderRatingStars(product.rating)}</div>
            <span className="text-gray-500 text-sm">({product.reviews} reviews)</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold text-red-600">Rs. {product.new_price}</span>
            <span className="text-lg text-gray-400 line-through">Rs. {product.old_price}</span>
          </div>

          <p className="text-gray-600 leading-relaxed max-w-xl">
            {product.description}
          </p>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Select Size</h3>
            <div className="flex flex-wrap gap-3">
              {["S", "M", "L", "XL", "XXL"].map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 rounded-md border text-sm font-medium transition-all
                  ${
                    selectedSize === size
                      ? "bg-red-500 text-white border-red-500"
                      : "bg-white text-gray-700 hover:border-red-500"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
                onClick={() => {
                if (!localStorage.getItem('auth-token')) {
                    alert("Please login to add items to your cart!");
                    return;
                }
                if (selectedSize) {
                    addToCart(product.id, selectedSize);
                    alert("Added to cart successfully!");
                } else {
                    alert("Please Select Size");
                }
                }}
                className="flex-1 px-12 py-4 bg-red-500 text-white font-bold rounded-lg
                hover:bg-red-600 transform transition-all active:scale-95 shadow-md uppercase"
            >
                ADD TO CART
            </button>
            <button
                onClick={() => setIsBodyTryOnOpen(true)}
                className="flex-1 px-12 py-4 bg-gray-800 text-white font-bold rounded-lg
                hover:bg-black transform transition-all active:scale-95 shadow-md flex items-center justify-center gap-2 uppercase"
            >
                <User className="w-5 h-5" />
                VIRTUAL TRY-ON
            </button>
          </div>

          <div className="pt-6 border-t border-gray-100 flex flex-col gap-2 text-sm text-gray-500">
            <p>
              <span className="font-semibold text-gray-800">Category:</span> {product.category}, T-Shirt, Crop Top
            </p>
            <p>
              <span className="font-semibold text-gray-800">Tags:</span> Modern, Latest
            </p>
          </div>
        </div>
      </div>

      {/* Try-On Modal */}
      <BodyTryOn isOpen={isBodyTryOnOpen} onClose={() => setIsBodyTryOnOpen(false)} product={product} />
    </div>
  );
};

export default ProductDisplay;
