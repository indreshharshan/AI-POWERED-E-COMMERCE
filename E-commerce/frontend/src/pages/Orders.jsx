import React, { useEffect, useState } from 'react';
import { API_URL } from '../config';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const payment = queryParams.get('payment');
    const orderId = queryParams.get('orderId');

    const verifyStripePayment = async () => {
      try {
        const verifyRes = await fetch(`${API_URL}/api/payment/stripe/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('auth-token')
          },
          body: JSON.stringify({ orderId })
        });
        const verifyData = await verifyRes.json();
        if (verifyData.success) {
          alert("Stripe Payment Verified! Order Placed successfully.");
          // Clear query params
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      } catch (err) {
        console.error("Error verifying Stripe payment:", err);
      }
    };

    const fetchOrders = async () => {
      if (localStorage.getItem('auth-token')) {
        try {
          const response = await fetch(`${API_URL}/api/order/my-orders`, {
            method: 'GET',
            headers: {
              'auth-token': localStorage.getItem('auth-token'),
              'Content-Type': 'application/json',
            },
          });
          const data = await response.json();
          if (data.success) {
            setOrders(data.orders);
          }
        } catch (error) {
          console.error("Error fetching orders:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    const runFlow = async () => {
      if (payment === 'stripe_success' && orderId) {
        await verifyStripePayment();
      }
      await fetchOrders();
    };

    runFlow();
  }, []);

  if (loading) {
    return <div className="text-center py-20 text-xl text-gray-500">Loading Orders...</div>;
  }

  if (!localStorage.getItem('auth-token')) {
    return <div className="text-center py-20 text-xl text-gray-500">Please login to view your orders.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pt-28">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      {orders.length === 0 ? (
        <p className="text-gray-500 text-lg">You have no past orders.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order, index) => (
            <div key={order._id || index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-center border-b pb-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Order ID: <span className="font-semibold text-gray-800">{order._id}</span></p>
                  <p className="text-sm text-gray-500">Placed on: {new Date(order.date).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-gray-800">Total: Rs. {order.totalAmount}</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                    {order.status}
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-4">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md border" />
                    <div className="flex-1">
                      <h4 className="text-md font-medium text-gray-800">{item.name}</h4>
                      <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-gray-800">Rs. {item.price * item.quantity}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
