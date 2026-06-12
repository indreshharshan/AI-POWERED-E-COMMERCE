import { useState, useEffect } from "react";
import { API_URL } from "../../../config";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_URL}/api/order/all-orders`);
      const data = await response.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/api/order/status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      const data = await response.json();
      if (data.success) {
        setOrders(orders.map(order => order._id === orderId ? { ...order, status: newStatus } : order));
        alert("Order status updated successfully!");
      } else {
        alert(data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Error updating order status");
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-xl text-gray-500 ml-16 md:ml-64">Loading orders...</div>;
  }

  return (
    <div className="ml-16 md:ml-64 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm border-b">
                <th className="px-6 py-3 font-medium">Order ID</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Customer</th>
                <th className="px-6 py-3 font-medium">Items</th>
                <th className="px-6 py-3 font-medium">Total (Rs)</th>
                <th className="px-6 py-3 font-medium">Payment</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-10 text-center text-gray-500">No orders found.</td>
                </tr>
              ) : (
                orders.map((order) => {
                  const totalItems = Array.isArray(order.items)
                    ? order.items.reduce((sum, item) => sum + (item.quantity || 0), 0)
                    : 0;
                  const customerName = order.address 
                    ? `${order.address.firstName} ${order.address.lastName}`
                    : "Unknown User";

                  return (
                    <tr key={order._id} className="hover:bg-gray-50 text-gray-700">
                      <td className="px-6 py-4 text-xs font-semibold text-gray-800">{order._id}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(order.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">
                        <div>{customerName}</div>
                        {order.address && (
                          <div className="text-[11px] text-gray-400 font-normal">
                            {order.address.street}, {order.address.city}, {order.address.phone}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{totalItems}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-800">Rs. {order.totalAmount}</td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {order.paymentMethod || 'COD'} ({order.paymentStatus || 'Unpaid'})
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                          order.status === 'Shipped' ? 'bg-purple-100 text-purple-700' :
                          order.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                          order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <select 
                          className="text-sm border border-gray-300 rounded-md px-2 py-1 outline-none focus:border-red-500"
                          value={order.status}
                          onChange={(e) => updateStatus(order._id, e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;
