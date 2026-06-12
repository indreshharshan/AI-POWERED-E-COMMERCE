import arrow_icon from "../assets/breadcrum_arrow.png";
import { HiOutlineChevronRight } from "react-icons/hi2";
const Breadcrum = (props) => {
  const { product } = props;
  return (
    <div className="mt-25">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center flex-wrap gap-2 text-sm">
          <a href="/" className="text-black hover:text-red-500 transition-colors">
            HOME
          </a>
          
          <HiOutlineChevronRight className="w-4 h-4 text-gray-700" />
          
          <a href="/shop" className="text-black hover:text-red-500 transition-colors">
            SHOP
          </a>
          
           <HiOutlineChevronRight className="w-4 h-4 text-gray-700" />
          
          <a 
            href={`/shop/${product.category}`} 
            className="text-black hover:text-red-500 transition-colors"
          >
            {product.category}
          </a>
          
           <HiOutlineChevronRight className="w-4 h-4 text-gray-700" />
          
          <span className="text-gray-600">
            {product.name}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Breadcrum;