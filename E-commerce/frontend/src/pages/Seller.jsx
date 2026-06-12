
import React, { useState } from 'react'
import upload_area from '../assets/upload_area.svg'
import { API_URL } from '../config'

const Seller = () => {
  const [image, setImage] = useState(false);
  const [productDetails, setProductDetails] = useState({
    name: "",
    description: "",
    image: "",
    category: "women",
    occasion: "casual",
    new_price: "",
    old_price: ""
  });

  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  }

  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value })
  }

  const Add_Product = async () => {
    console.log(productDetails);
    let responseData;
    let product = productDetails;

    let formData = new FormData();
    formData.append('product', image);

    await fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: formData,
    }).then((resp) => resp.json()).then((data) => { responseData = data });

    if (responseData.success) {
      product.image = responseData.image_url;
      console.log(product);
      await fetch(`${API_URL}/products/addproduct`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      }).then((resp) => resp.json()).then((data) => {
        data.success ? alert("Product Added Successfully") : alert("Failed")
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-red-500 py-6 px-8">
          <h1 className="text-3xl font-bold text-white text-center">Become a Seller</h1>
          <p className="text-red-100 text-center mt-2">List your products and start earning today!</p>
        </div>
        
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Product Title</label>
              <input 
                value={productDetails.name} 
                onChange={changeHandler} 
                type="text" 
                name="name" 
                placeholder="Type here" 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <textarea 
                value={productDetails.description} 
                onChange={changeHandler} 
                name="description" 
                placeholder="Describe your product..." 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none h-32 resize-none"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Price</label>
                <input 
                  value={productDetails.old_price} 
                  onChange={changeHandler} 
                  type="text" 
                  name="old_price" 
                  placeholder="Type here" 
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Offer Price</label>
                <input 
                  value={productDetails.new_price} 
                  onChange={changeHandler} 
                  type="text" 
                  name="new_price" 
                  placeholder="Type here" 
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Product Category</label>
                <select 
                  value={productDetails.category} 
                  onChange={changeHandler} 
                  name="category" 
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none bg-white"
                >
                  <option value="women">Women</option>
                  <option value="men">Men</option>
                  <option value="kid">Kid</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Occasion</label>
                <select 
                  value={productDetails.occasion} 
                  onChange={changeHandler} 
                  name="occasion" 
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none bg-white"
                >
                  <option value="casual">Casual</option>
                  <option value="formal">Formal</option>
                  <option value="party">Party</option>
                  <option value="sports">Sports</option>
                  <option value="ethnic">Ethnic</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Product Image</label>
              <div className="flex items-center justify-center w-full">
                <label htmlFor="file-input" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all overflow-hidden relative">
                  {image ? (
                    <img src={URL.createObjectURL(image)} alt="Product" className="w-full h-full object-contain p-2" />
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <img src={upload_area} alt="" className="w-16 h-16 mb-4 opacity-50" />
                      <p className="mb-2 text-sm text-gray-500 font-semibold text-center px-4">Click to upload or drag and drop</p>
                    </div>
                  )}
                  <input onChange={imageHandler} type="file" name="image" id="file-input" hidden />
                </label>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button 
              onClick={Add_Product} 
              className="w-full bg-red-500 text-white font-bold py-4 rounded-xl hover:bg-red-600 transform hover:scale-[1.02] transition-all duration-200 shadow-lg active:scale-95"
            >
              ADD PRODUCT
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Seller
