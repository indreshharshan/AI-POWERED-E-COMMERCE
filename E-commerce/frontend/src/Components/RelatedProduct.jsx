import data_product from "../assets/data";
import Item from "./Item";

const RelatedProduct = ({ categoryProducts }) => {
  return (
    <div className="w-full py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-semibold text-gray-800 text-center mb-4">
          Related Products
        </h1>
         <div className="w-40 h-1 bg-red-500 mx-auto rounded-full mb-16"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categoryProducts.slice(0, 4).map((item, index) => {
            return (
              <div
                key={item.id}
                className="transform hover:scale-105 transition-transform duration-300"
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
    </div>
  );
};

export default RelatedProduct;
