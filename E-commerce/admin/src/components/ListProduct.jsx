import { useEffect, useState } from "react";
import cross_icon from "../assets/cross_icon.png";
import { API_URL } from "../../config";

const ListProduct = () => {
  const [AllProducts, setAllProducts] = useState([]);
  const fetchInfo = async () => {
    const res = await fetch(`${API_URL}/products/allproducts`);
    const data = await res.json();
    setAllProducts(data.reverse());
  };
  useEffect(() => {
    fetchInfo();
  }, []);
  const remove_product = async (id) => {
    await fetch(`${API_URL}/products/removeproduct`, {
      method:'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        
      },
      body: JSON.stringify({ id: id })
    })
    await fetchInfo();
  }
  return (
    <div className="ml-16 md:ml-64 p-4 md:p-8">
      {" "}
      {/* Offset for sidebar */}
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-semibold text-gray-800">
            All Products List
          </h1>
        </div>

        {/* Table Header - Hidden on Mobile */}
        <div className="hidden md:grid grid-cols-12 gap-2 px-6 py-3 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-700">
          <p className="col-span-2">Products</p>
          <p className="col-span-3">Title</p>
          <p className="col-span-2 text-center">Old Price</p>
          <p className="col-span-2 text-center">New Price</p>
          <p className="col-span-1 text-center">Category</p>
          <p className="col-span-1 text-center">Occasion</p>
          <p className="col-span-1 text-center">Action</p>
        </div>

        {/* Products List */}
        <div className="divide-y divide-gray-200">
          {AllProducts.map((product, index) => {
            return (
              <div
                key={index}
                className="flex flex-col md:grid md:grid-cols-12 gap-4 md:gap-2 px-6 py-4 items-start md:items-center hover:bg-gray-50 transition-colors duration-200"
              >
                {/* Product Image */}
                <div className="col-span-12 md:col-span-2 flex items-center justify-center md:justify-start">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-24 w-24 md:h-14 md:w-14 object-cover rounded-md shadow-sm"
                  />
                </div>

                {/* Product Title */}
                <div className="col-span-12 md:col-span-3 w-full">
                  <p className="text-base md:text-sm font-medium text-gray-800 line-clamp-2 text-center md:text-left">
                    {product.name}
                  </p>
                </div>

                {/* Old Price */}
                <div className="col-span-12 md:col-span-2 w-full flex justify-between md:block text-center">
                  <span className="md:hidden text-gray-500 text-sm">Old Price:</span>
                  <p className="text-sm text-gray-600">
                    Rs. {product.old_price.toFixed(2)}
                  </p>
                </div>

                {/* New Price */}
                <div className="col-span-12 md:col-span-2 w-full flex justify-between md:block text-center">
                  <span className="md:hidden text-gray-500 text-sm">New Price:</span>
                  <p className="text-sm font-medium text-green-600">
                    Rs. {product.new_price.toFixed(2)}
                  </p>
                </div>

                {/* Category */}
                <div className="col-span-12 md:col-span-1 w-full flex justify-between md:block text-center">
                  <span className="md:hidden text-gray-500 text-sm">Category:</span>
                  <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded-full capitalize">
                    {product.category}
                  </span>
                </div>

                {/* Occasion */}
                <div className="col-span-12 md:col-span-1 w-full flex justify-between md:block text-center">
                  <span className="md:hidden text-gray-500 text-sm">Occasion:</span>
                  <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-600 rounded-full capitalize">
                    {product.occasion || "casual"}
                  </span>
                </div>

                {/* Actions */}
                <div className="col-span-12 md:col-span-1 w-full flex justify-end md:justify-center gap-2">
                  <button
                    className="p-2 md:p-1.5 hover:bg-blue-50 rounded-full transition-colors duration-200 group flex items-center gap-2 md:block"
                    title="Edit Product"
                    onClick={() => {
                      alert("Edit functionality coming soon!");
                    }}
                  >
                    <span className="md:hidden text-blue-500 text-sm font-medium">Edit</span>
                    <svg className="h-4 w-4 text-gray-400 group-hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    className="p-2 md:p-1.5 hover:bg-red-50 rounded-full transition-colors duration-200 group flex items-center gap-2 md:block"
                    title="Remove Product"
                    onClick={() => {
                      remove_product(product.id)
                    }}
                  >
                    <span className="md:hidden text-red-500 text-sm font-medium">Remove</span>
                    <img
                      src={cross_icon} 
                      alt="Remove"
                      className="cursor-pointer h-4 w-4 opacity-60 group-hover:opacity-100"
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {AllProducts.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500 text-sm">
              No products found. Add some products to see them here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListProduct;

// export default ListProduct;
