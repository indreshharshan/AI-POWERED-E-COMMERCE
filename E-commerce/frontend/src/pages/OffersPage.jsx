import React, { useEffect, useState } from 'react';
import { API_URL } from '../config';
import Item from '../Components/Item';

const OffersPage = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch(`${API_URL}/products/offers`);
        const data = await response.json();
        setOffers(data);
      } catch (error) {
        console.error("Error fetching offers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  if (loading) {
    return <div className="text-center py-20 text-xl text-gray-500">Loading Offers...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pt-28">
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 inline-block mb-4">
          Special Offers & Deals 🎁
        </h1>
        <p className="text-gray-600 text-lg">Grab our best selling products at unbeatable prices.</p>
      </div>

      {offers.length === 0 ? (
        <p className="text-gray-500 text-lg text-center">No offers available at the moment.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {offers.map((item, index) => (
            <div key={index} className="relative group">
              <div className="absolute top-2 right-2 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md animate-pulse">
                {Math.round(((item.old_price - item.new_price) / item.old_price) * 100)}% OFF
              </div>
              <Item 
                id={item.id} 
                name={item.name} 
                image={item.image} 
                new_price={item.new_price} 
                old_price={item.old_price}
                rating={item.rating}
                reviews={item.reviews}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OffersPage;
