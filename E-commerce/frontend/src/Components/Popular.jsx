import { data } from "react-router-dom";
import Item from "./Item";
import { useState } from "react";
import { useEffect } from "react";
import { API_URL } from "../config";
const Popular = () => {
  const [popular, setPopular] = useState([]);
  useEffect(() => {
    const fetchPopular = async()=>{
    const res = await fetch(`${API_URL}/products/popular`);
      const data = await res.json();
      console.log(data);
       setPopular(data);
    }
    fetchPopular();
  }, []);
  
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
            POPULAR IN WOMEN
          </h2>
          <div className="w-24 h-1 bg-red-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {popular.map((item, index) => {
            return (
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
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Popular;
