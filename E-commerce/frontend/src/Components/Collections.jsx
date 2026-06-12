import { useState } from "react";

import Item from "./Item";
import { useEffect } from "react";
import { API_URL } from "../config";
const Collections = () => {
  const [new_collections, setNew_collection] = useState([]);
  useEffect(() => {
    fetch(`${API_URL}/products/newcollections`).then((res)=> res.json()).then((data)=> setNew_collection(data));
  },[])
  return (
    <section id="new-collections" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            NEW COLLECTIONS
          </h2>
          <div className="w-24 h-1 bg-red-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {new_collections.map((item, index) => (
            <div
              key={index}
              className="transform hover:-translate-y-1 transition-transform duration-300"
            >
              <Item
                id={item.id}
                image={item.image}
                name={item.name}
                new_price={item.new_price}
                old_price={item.old_price}
                category={item.category}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Collections;
