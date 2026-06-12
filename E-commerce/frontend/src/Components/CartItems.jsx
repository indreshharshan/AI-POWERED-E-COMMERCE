import { useContext, useState } from "react";
import { ShopContext } from "../Context/ShopContext";
import { RxCross2 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import { loadRazorpay } from "../utils/loadRazorpay";

const CartItems = () => {
  const { 
    all_product, 
    cartItems, 
    addToCart, 
    removeFromCart, 
    getTotalAmount,
    promoCode,
    setPromoCode,
    promoLoading,
    promoMessage,
    appliedPromo,
    handleApplyPromo,
    handleRemovePromo,
    getFinalTotal
  } = useContext(ShopContext);
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md">
        {/* Header - Hidden on mobile */}
        <div className="hidden md:grid grid-cols-6 gap-4 p-4 bg-gray-50 rounded-t-lg text-gray-700 font-semibold">
          <p className="col-span-2">Products</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p className="text-center">Remove</p>
        </div>

        <div className="divide-y divide-gray-200">
          {all_product.map((e) => {
            if (cartItems[e.id] !== 0) {
              return (
                <div
                  key={e.id}
                  className="flex flex-col md:grid md:grid-cols-6 gap-4 p-4 items-center hover:bg-gray-50 transition-colors relative"
                >
                  {/* Product Image and Name */}
                  <div className="col-span-2 flex items-center gap-4 w-full md:w-auto">
                    <img
                      src={e.image}
                      alt={e.name}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    <p className="font-medium text-gray-800 text-sm md:text-base flex-1">{e.name}</p>
                    <button
                      onClick={() => removeFromCart(e.id)}
                      className="md:hidden p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <RxCross2 size={20} />
                    </button>
                  </div>

                  {/* Price */}
                  <div className="flex justify-between w-full md:w-auto md:block">
                    <span className="md:hidden text-gray-500">Price:</span>
                    <p className="text-gray-700">Rs. {e.new_price}</p>
                  </div>

                  {/* Quantity */}
                  <div className="flex justify-between items-center w-full md:w-auto md:block">
                    <span className="md:hidden text-gray-500">Quantity:</span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => removeFromCart(e.id)}
                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                      >
                        -
                      </button>
                      <span className="px-4 py-1 bg-gray-100 rounded">
                        {cartItems[e.id]}
                      </span>
                      <button
                        onClick={() => addToCart(e.id)}
                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between w-full md:w-auto md:block">
                    <span className="md:hidden text-gray-500">Total:</span>
                    <p className="text-gray-700 font-medium">
                      Rs. {(e.new_price * cartItems[e.id]).toFixed(2)}
                    </p>
                  </div>

                  {/* Remove Button - Desktop */}
                  <div className="hidden md:flex justify-center">
                    <button
                      onClick={() => removeFromCart(e.id)}
                      className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full cursor-pointer transition-colors"
                    >
                      <RxCross2 size={20} />
                    </button>
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>

      {/* Cart total + promo section */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Promo Code Box */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-700 font-medium mb-4">🎟️ Have a promo code? Enter it here</p>

          {appliedPromo ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-700 font-bold text-sm">✅ Applied: <span className="font-mono">{appliedPromo.code}</span></p>
                  <p className="text-green-600 text-sm mt-1">You saved Rs. {appliedPromo.discountAmount.toFixed(2)}</p>
                </div>
                <button
                  onClick={handleRemovePromo}
                  className="text-red-400 hover:text-red-600 transition-colors text-sm underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-3">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
                placeholder="Enter promo code (e.g. LOKI10)"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent outline-none transition-all uppercase"
              />
              <button
                onClick={handleApplyPromo}
                disabled={promoLoading}
                className="bg-gray-800 hover:bg-gray-900 disabled:bg-gray-400 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200 whitespace-nowrap"
              >
                {promoLoading ? "Checking..." : "Apply"}
              </button>
            </div>
          )}

          {promoMessage.text && !appliedPromo && (
            <div className={`mt-3 text-sm font-medium px-3 py-2 rounded-lg ${
              promoMessage.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-600 border border-red-100"
            }`}>
              {promoMessage.text}
            </div>
          )}
        </div>

        {/* Cart Total Box */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-3">
            Cart Total
          </h1>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3">
              <p className="text-gray-600 font-medium">Subtotal</p>
              <p className="text-lg font-semibold text-gray-600">Rs. {getTotalAmount()}</p>
            </div>

            {appliedPromo && (
              <>
                <hr className="border-gray-200" />
                <div className="flex justify-between items-center py-3">
                  <p className="text-green-600 font-medium">Promo Discount ({appliedPromo.code})</p>
                  <p className="text-green-600 font-semibold">- Rs. {appliedPromo.discountAmount.toFixed(2)}</p>
                </div>
              </>
            )}

            <hr className="border-gray-200" />
            <div className="flex justify-between items-center py-3">
              <p className="text-gray-600 font-medium">Shipping Fee</p>
              <p className="text-green-600 font-semibold">Free</p>
            </div>
            <hr className="border-gray-200" />
            <div className="flex justify-between items-center py-3 bg-gray-50 rounded-lg px-2">
              <h3 className="text-xl font-bold text-gray-800">Total</h3>
              <h3 className="text-xl font-bold text-gray-800">
                Rs. {getFinalTotal().toFixed ? getFinalTotal().toFixed(2) : getFinalTotal()}
              </h3>
            </div>
            <button
              onClick={() => {
                if (!localStorage.getItem('auth-token')) {
                  alert('Please login to proceed to checkout');
                  navigate('/login');
                  return;
                }
                
                let hasItems = false;
                for (const item in cartItems) {
                  if (cartItems[item] > 0) {
                    hasItems = true;
                    break;
                  }
                }
                
                if (!hasItems) {
                  alert('Your cart is empty');
                  return;
                }
                
                navigate('/place-order');
              }}
              className="w-full bg-red-500 hover:bg-red-700 cursor-pointer text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg text-center block"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CartItems;
