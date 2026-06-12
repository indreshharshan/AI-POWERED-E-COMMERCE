import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../Context/ShopContext';
import { API_URL } from '../config';
import { loadRazorpay } from '../utils/loadRazorpay';

const PlaceOrder = () => {
  const { 
    all_product, 
    cartItems, 
    getTotalAmount, 
    appliedPromo, 
    getFinalTotal 
  } = useContext(ShopContext);
  
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: ''
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData(data => ({ ...data, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    // Validate inputs
    for (const key in formData) {
      if (!formData[key].trim()) {
        alert(`Please fill in all delivery information fields. Missing: ${key}`);
        return;
      }
    }

    let items = [];
    all_product.forEach((product) => {
      if (cartItems[product.id] > 0) {
        items.push({
          productId: product.id,
          name: product.name,
          price: product.new_price,
          quantity: cartItems[product.id],
          image: product.image,
        });
      }
    });

    if (items.length === 0) {
      alert('Your cart is empty');
      navigate('/cart');
      return;
    }

    const subtotal = getFinalTotal();
    const shippingFee = subtotal > 0 ? 10 : 0; // standard flat fee Rs. 10 to match mockup
    const totalAmount = subtotal + shippingFee;

    setLoading(true);

    try {
      const orderData = {
        items,
        totalAmount,
        address: formData,
        paymentMethod: paymentMethod === 'cod' ? 'COD' : (paymentMethod === 'stripe' ? 'Stripe' : 'Razorpay'),
        paymentStatus: 'Unpaid'
      };

      if (paymentMethod === "cod") {
        const response = await fetch(`${API_URL}/api/order/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('auth-token')
          },
          body: JSON.stringify(orderData)
        });
        const data = await response.json();
        if (data.success) {
          alert("Order placed successfully via Cash on Delivery!");
          window.location.replace('/orders');
        } else {
          alert(data.message || "Failed to place order");
        }
      } else if (paymentMethod === "razorpay") {
        const paymentRes = await fetch(`${API_URL}/api/payment/razorpay/order`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('auth-token'),
          },
          body: JSON.stringify({ amount: totalAmount }),
        });
        const paymentData = await paymentRes.json();
        if (!paymentData.success) {
          alert('Failed to initiate payment');
          setLoading(false);
          return;
        }

        const loaded = await loadRazorpay();
        if (!loaded) {
          alert('Failed to load Razorpay SDK');
          setLoading(false);
          return;
        }

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: paymentData.amount,
          currency: 'INR',
          name: 'Shopper',
          description: 'Order Payment',
          order_id: paymentData.orderId,
          handler: async (response) => {
            const verifyRes = await fetch(`${API_URL}/api/payment/razorpay/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('auth-token'),
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              const orderRes = await fetch(`${API_URL}/api/order/create`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'auth-token': localStorage.getItem('auth-token'),
                },
                body: JSON.stringify({
                  ...orderData,
                  paymentStatus: 'Paid',
                  razorpayOrderId: response.razorpay_order_id,
                }),
              });
              const orderDataRes = await orderRes.json();
              if (orderDataRes.success) {
                alert('Order placed successfully!');
                window.location.replace('/orders');
              } else {
                alert('Order creation failed');
              }
            } else {
              alert('Payment verification failed');
            }
          },
          prefill: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            contact: formData.phone,
          },
          theme: { color: '#000000' },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else if (paymentMethod === "stripe") {
        // Create order in DB first (marked unpaid)
        const orderRes = await fetch(`${API_URL}/api/order/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('auth-token'),
          },
          body: JSON.stringify({
            ...orderData,
            paymentMethod: 'Stripe',
            paymentStatus: 'Unpaid'
          }),
        });
        const orderDataRes = await orderRes.json();
        if (orderDataRes.success) {
          // Request checkout session from backend
          const stripeRes = await fetch(`${API_URL}/api/payment/stripe/order`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'auth-token': localStorage.getItem('auth-token'),
            },
            body: JSON.stringify({
              amount: totalAmount,
              orderId: orderDataRes.order._id
            }),
          });
          const stripeData = await stripeRes.json();
          if (stripeData.success) {
            window.location.replace(stripeData.sessionUrl);
          } else {
            alert('Failed to initiate Stripe payment redirect');
          }
        } else {
          alert('Order creation failed for Stripe checkout');
        }
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const subtotal = getFinalTotal();
  const shippingFee = subtotal > 0 ? 10 : 0;
  const totalAmount = subtotal + shippingFee;

  return (
    <form onSubmit={handlePlaceOrder} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pt-28 flex flex-col lg:flex-row gap-16 justify-between items-start">
      {/* Left side: Delivery Info */}
      <div className="w-full lg:max-w-[480px] space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-2xl font-bold text-gray-800 tracking-wide uppercase">Delivery Information</h2>
          <div className="h-[2px] bg-gray-300 flex-1 ml-4"></div>
        </div>

        <div className="flex gap-4">
          <input 
            required 
            type="text" 
            name="firstName" 
            placeholder="First name" 
            value={formData.firstName} 
            onChange={onChangeHandler}
            className="w-1/2 px-4 py-3 border border-gray-300 rounded-md outline-none focus:border-black transition-all text-sm"
          />
          <input 
            required 
            type="text" 
            name="lastName" 
            placeholder="Last name" 
            value={formData.lastName} 
            onChange={onChangeHandler}
            className="w-1/2 px-4 py-3 border border-gray-300 rounded-md outline-none focus:border-black transition-all text-sm"
          />
        </div>

        <input 
          required 
          type="email" 
          name="email" 
          placeholder="Email address" 
          value={formData.email} 
          onChange={onChangeHandler}
          className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none focus:border-black transition-all text-sm"
        />

        <input 
          required 
          type="text" 
          name="street" 
          placeholder="Street" 
          value={formData.street} 
          onChange={onChangeHandler}
          className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none focus:border-black transition-all text-sm"
        />

        <div className="flex gap-4">
          <input 
            required 
            type="text" 
            name="city" 
            placeholder="City" 
            value={formData.city} 
            onChange={onChangeHandler}
            className="w-1/2 px-4 py-3 border border-gray-300 rounded-md outline-none focus:border-black transition-all text-sm"
          />
          <input 
            required 
            type="text" 
            name="state" 
            placeholder="State" 
            value={formData.state} 
            onChange={onChangeHandler}
            className="w-1/2 px-4 py-3 border border-gray-300 rounded-md outline-none focus:border-black transition-all text-sm"
          />
        </div>

        <div className="flex gap-4">
          <input 
            required 
            type="text" 
            name="zipcode" 
            placeholder="Zipcode" 
            value={formData.zipcode} 
            onChange={onChangeHandler}
            className="w-1/2 px-4 py-3 border border-gray-300 rounded-md outline-none focus:border-black transition-all text-sm"
          />
          <input 
            required 
            type="text" 
            name="country" 
            placeholder="Country" 
            value={formData.country} 
            onChange={onChangeHandler}
            className="w-1/2 px-4 py-3 border border-gray-300 rounded-md outline-none focus:border-black transition-all text-sm"
          />
        </div>

        <input 
          required 
          type="text" 
          name="phone" 
          placeholder="Phone" 
          value={formData.phone} 
          onChange={onChangeHandler}
          className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none focus:border-black transition-all text-sm"
        />
      </div>

      {/* Right side: Cart Totals and Payment Methods */}
      <div className="w-full lg:max-w-[500px] flex-1">
        
        {/* Cart Totals Panel */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 tracking-wide uppercase">Cart Totals</h2>
            <div className="h-[2px] bg-gray-300 flex-1 ml-4"></div>
          </div>
          
          <div className="space-y-4 text-sm text-gray-700">
            <div className="flex justify-between py-2 border-b">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-900">Rs. {getTotalAmount()}</span>
            </div>
            
            {appliedPromo && (
              <div className="flex justify-between py-2 border-b text-green-600">
                <span>Promo Discount ({appliedPromo.code})</span>
                <span className="font-semibold">- Rs. {appliedPromo.discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between py-2 border-b">
              <span>Shipping Fee</span>
              <span className="font-semibold text-gray-900">
                {shippingFee > 0 ? `Rs. ${shippingFee.toFixed(2)}` : 'Free'}
              </span>
            </div>
            <div className="flex justify-between py-2 text-base font-bold text-gray-900">
              <span>Total</span>
              <span>Rs. {totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Payment Methods Panel */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-lg font-bold text-gray-800 tracking-wide uppercase">Payment Method</h2>
            <div className="h-[2px] bg-gray-300 flex-1 ml-4"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Stripe Card */}
            <div 
              onClick={() => setPaymentMethod("stripe")}
              className={`flex items-center gap-3 border p-4 px-3 rounded-md cursor-pointer hover:bg-gray-50 transition-all ${paymentMethod === 'stripe' ? 'border-green-500 bg-green-50/10' : 'border-gray-200'}`}
            >
              <div className={`w-[14px] h-[14px] rounded-full border flex items-center justify-center ${paymentMethod === 'stripe' ? 'border-green-500' : 'border-gray-300'}`}>
                {paymentMethod === 'stripe' && <div className="w-[8px] h-[8px] rounded-full bg-green-500"></div>}
              </div>
              {/* Stripe Label / Logo */}
              <div className="font-bold tracking-wide text-indigo-600 text-sm select-none">Stripe</div>
            </div>

            {/* Razorpay Card */}
            <div 
              onClick={() => setPaymentMethod("razorpay")}
              className={`flex items-center gap-3 border p-4 px-3 rounded-md cursor-pointer hover:bg-gray-50 transition-all ${paymentMethod === 'razorpay' ? 'border-green-500 bg-green-50/10' : 'border-gray-200'}`}
            >
              <div className={`w-[14px] h-[14px] rounded-full border flex items-center justify-center ${paymentMethod === 'razorpay' ? 'border-green-500' : 'border-gray-300'}`}>
                {paymentMethod === 'razorpay' && <div className="w-[8px] h-[8px] rounded-full bg-green-500"></div>}
              </div>
              {/* Razorpay Logo SVG */}
              <svg className="h-[15px] select-none" viewBox="0 0 120 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.6 4.3L3.1 19.9H14.1L12.5 24.3H0L2.8 20.5L13.1 6.5H4L5.6 2.1H15.4L14.6 4.3Z" fill="#0A2540"/>
                <path d="M22.9 8.2H18.7V24.3H22.9V14.8C22.9 12.3 24.1 11.2 26.2 11.2C27.9 11.2 28.7 12 28.7 13.9V24.3H32.9V13.5C32.9 9.8 30.6 8 27.2 8C25 8 23.6 9 22.9 10.3V8.2Z" fill="#0A2540"/>
                <path d="M41.7 8C37.8 8 35.1 11.1 35.1 16.2C35.1 21.3 37.8 24.4 41.7 24.4C44 24.4 45.9 23.3 46.8 21.6V24.1H50.8V8.2H46.8V10.8C45.9 9.1 44 8 41.7 8ZM42.9 20.6C40.6 20.6 39.2 18.9 39.2 16.2C39.2 13.5 40.6 11.8 42.9 11.8C45.2 11.8 46.6 13.5 46.6 16.2C46.6 18.9 45.2 20.6 42.9 20.6Z" fill="#0A2540"/>
                <path d="M54.5 20.1C55.6 21.1 57.3 21.7 59.2 21.7C61.4 21.7 62.4 20.8 62.4 19.6C62.4 18.5 61.2 17.9 59.3 17.3L56.7 16.5C54.1 15.7 52.4 14.1 52.4 11.4C52.4 8.7 55 7.8 58.7 7.8C61 7.8 63.3 8.5 64.9 9.9L63.3 12.8C62.1 11.9 60.5 11.3 58.7 11.3C56.9 11.3 56 12 56 13C56 14.1 57.1 14.7 59.3 15.3L61.9 16.1C64.6 16.9 66 18.7 66 21.2C66 24.1 63.3 25.1 59.1 25.1C56.8 25.1 54.4 24.4 52.8 23L54.5 20.1Z" fill="#0A2540"/>
                <path d="M78.6 8C73.9 8 70.3 11.5 70.3 16.2C70.3 21 73.9 24.4 78.6 24.4C83.3 24.4 86.9 21 86.9 16.2C86.9 11.5 83.3 8 78.6 8ZM78.6 20.8C76.1 20.8 74.4 19 74.4 16.2C74.4 13.4 76.1 11.6 78.6 11.6C81.1 11.6 82.8 13.4 82.8 16.2C82.8 19 81.1 20.8 78.6 20.8Z" fill="#0A2540"/>
                <path d="M96.1 8C93.9 8 92.5 9 91.8 10.3V8.2H87.8V28.1H91.8V21.6C92.5 23 93.9 24 96.1 24C100 24 102.7 20.9 102.7 15.8C102.7 10.7 100 8 96.1 8ZM94.9 20.2C92.6 20.2 91.2 18.5 91.2 15.8C91.2 13.1 92.6 11.4 94.9 11.4C97.2 11.4 98.6 13.1 98.6 15.8C98.6 18.5 97.2 20.2 94.9 20.2Z" fill="#0A2540"/>
                <path d="M109.9 8C106 8 103.3 11.1 103.3 16.2C103.3 21.3 106 24.4 109.9 24.4C112.2 24.4 114.1 23.3 115 21.6V24.1H119V8.2H115V10.8C114.1 9.1 112.2 8 109.9 8ZM111.1 20.6C108.8 20.6 107.4 18.9 107.4 16.2C107.4 13.5 108.8 11.8 111.1 11.8C113.4 11.8 114.8 13.5 114.8 16.2C114.8 18.9 113.4 20.6 111.1 20.6Z" fill="#0A2540"/>
              </svg>
            </div>

            {/* Cash on Delivery Card */}
            <div 
              onClick={() => setPaymentMethod("cod")}
              className={`flex items-center gap-3 border p-4 px-3 rounded-md cursor-pointer hover:bg-gray-50 transition-all ${paymentMethod === 'cod' ? 'border-green-500 bg-green-50/10' : 'border-gray-200'}`}
            >
              <div className={`w-[14px] h-[14px] rounded-full border flex items-center justify-center ${paymentMethod === 'cod' ? 'border-green-500' : 'border-gray-300'}`}>
                {paymentMethod === 'cod' && <div className="w-[8px] h-[8px] rounded-full bg-green-500"></div>}
              </div>
              <div className="text-[10px] font-bold text-gray-500 tracking-tighter select-none whitespace-nowrap uppercase">Cash on Delivery</div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
            <button 
              type="submit" 
              disabled={loading}
              className="bg-black hover:bg-gray-900 text-white font-bold py-3 px-12 text-sm uppercase tracking-wider rounded cursor-pointer transition-colors"
            >
              {loading ? 'Placing...' : 'PLACE ORDER'}
            </button>
          </div>
        </div>

      </div>
    </form>
  );
};

export default PlaceOrder;
