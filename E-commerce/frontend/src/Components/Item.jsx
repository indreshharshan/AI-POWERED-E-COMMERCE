import { Link } from "react-router-dom";
import { useContext } from "react";
import { ShopContext } from "../Context/ShopContext";
import { RiHeartLine, RiEyeLine, RiShoppingBag3Line, RiStarFill } from "react-icons/ri";

const Item = (props) => {
  const { addToCart } = useContext(ShopContext);
  const discount = Math.round(((props.old_price - props.new_price) / props.old_price) * 100);

  return (
    <div className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100">
      {/* Product Image Area */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
        <Link to={`/product/${props.category}/${props.id}`}>
          <img
            src={props.image}
            alt={props.name}
            className="w-full h-full object-cover object-center transform transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {discount > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg animate-pulse">
              -{discount}% OFF
            </span>
          )}
          {props.id % 5 === 0 && (
            <span className="bg-black text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg">
              NEW ARRIVAL
            </span>
          )}
        </div>

        {/* Action Icons (Hover) */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 z-10">
          <button className="p-3 bg-white hover:bg-red-500 hover:text-white text-gray-700 rounded-full shadow-xl transition-all duration-300">
            <RiHeartLine size={18} />
          </button>
          <button className="p-3 bg-white hover:bg-gray-900 hover:text-white text-gray-700 rounded-full shadow-xl transition-all duration-300">
            <RiEyeLine size={18} />
          </button>
        </div>

        {/* Quick Add Button (Bottom Hover) */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-10">
          <button 
            onClick={() => {
              if (localStorage.getItem('auth-token')) {
                addToCart(props.id);
                alert("Item added to cart!");
              } else {
                alert("Please login to add items to your cart!");
              }
            }}
            className="w-full bg-white/90 backdrop-blur-md text-gray-900 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-2xl hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
          >
            <RiShoppingBag3Line size={16} /> Quick Add
          </button>
        </div>
      </div>

      {/* Product Info Section */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest opacity-70">
                {props.category}
            </span>
            <div className="flex items-center gap-1">
                <RiStarFill size={12} className="text-amber-400" />
                <span className="text-[10px] font-bold text-gray-500">4.8</span>
            </div>
        </div>
        
        <Link to={`/product/${props.category}/${props.id}`}>
            <h3 className="text-gray-900 font-bold text-sm mb-3 line-clamp-1 group-hover:text-red-500 transition-colors">
                {props.name}
            </h3>
        </Link>

        <div className="flex items-center gap-3">
          <span className="text-gray-900 font-black text-lg">
            Rs. {props.new_price}
          </span>
          {props.old_price > props.new_price && (
            <span className="text-gray-400 line-through text-xs font-medium">
              Rs. {props.old_price}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Item;
