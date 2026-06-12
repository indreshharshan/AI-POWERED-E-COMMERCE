import { useState, useEffect } from "react";
import { FaTag, FaTrash } from "react-icons/fa";

import { API_URL } from "../../../config";

const Offers = () => {
  const [coupons, setCoupons] = useState([]);
  const [newCode, setNewCode] = useState("");
  const [newDiscount, setNewDiscount] = useState("");
  const [discountType, setDiscountType] = useState("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [minOrder, setMinOrder] = useState("500");
  const [expiry, setExpiry] = useState("2026-12-31");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Fetch all coupons from backend
  const fetchCoupons = async () => {
    try {
      const res = await fetch(`${API_URL}/api/coupon/all`);
      const data = await res.json();
      if (data.success) setCoupons(data.coupons);
    } catch (err) {
      console.error("Failed to fetch coupons", err);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const addCoupon = async (e) => {
    e.preventDefault();
    if (!newCode || !discountValue || !expiry) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/coupon/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: newCode,
          discount: discountType === "percentage" ? `${discountValue}%` : `Rs. ${discountValue}`,
          discountType,
          discountValue: parseFloat(discountValue),
          minOrder: parseFloat(minOrder) || 0,
          expiry
        })
      });
      const data = await res.json();
      if (data.success) {
        showMessage("✅ Coupon created successfully!", "success");
        setNewCode("");
        setNewDiscount("");
        setDiscountValue("");
        setMinOrder("500");
        fetchCoupons();
      } else {
        showMessage(`❌ ${data.message}`, "error");
      }
    } catch (err) {
      showMessage("❌ Failed to create coupon", "error");
    } finally {
      setLoading(false);
    }
  };

  const deleteCoupon = async (id) => {
    if (!window.confirm("Delete this coupon?")) return;
    try {
      const res = await fetch(`${API_URL}/api/coupon/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showMessage("🗑️ Coupon deleted", "success");
        fetchCoupons();
      }
    } catch (err) {
      showMessage("❌ Failed to delete coupon", "error");
    }
  };

  return (
    <div className="ml-16 md:ml-64 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Create Coupon Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaTag className="text-red-500" /> Create New Coupon
          </h2>

          {message.text && (
            <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${
              message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={addCoupon} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Coupon Code *</label>
              <input
                type="text"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                placeholder="e.g. LOKI10"
                className="w-full border border-gray-300 rounded-md px-4 py-2 outline-none focus:border-red-500 uppercase"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Discount Type *</label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 outline-none focus:border-red-500"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="flat">Flat Amount (Rs.)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Discount Value * {discountType === "percentage" ? "(%)" : "(Rs.)"}
              </label>
              <input
                type="number"
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                placeholder={discountType === "percentage" ? "e.g. 10" : "e.g. 100"}
                className="w-full border border-gray-300 rounded-md px-4 py-2 outline-none focus:border-red-500"
                required
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Min Order Amount (Rs.)</label>
              <input
                type="number"
                value={minOrder}
                onChange={(e) => setMinOrder(e.target.value)}
                placeholder="e.g. 500"
                className="w-full border border-gray-300 rounded-md px-4 py-2 outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Expiry Date *</label>
              <input
                type="date"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 outline-none focus:border-red-500"
                required
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-6 py-2 rounded-md transition-colors font-medium"
              >
                {loading ? "Creating..." : "Create Coupon"}
              </button>
            </div>
          </form>
        </div>

        {/* List Coupons Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-800">All Coupons ({coupons.length})</h1>
          </div>
          <div className="overflow-x-auto">
            {coupons.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <FaTag className="text-4xl mx-auto mb-3 opacity-30" />
                <p>No coupons created yet</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 text-sm border-b">
                    <th className="px-6 py-3 font-medium">Code</th>
                    <th className="px-6 py-3 font-medium">Discount</th>
                    <th className="px-6 py-3 font-medium">Min Order</th>
                    <th className="px-6 py-3 font-medium">Expiry</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {coupons.map((coupon) => (
                    <tr key={coupon._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-bold text-red-600">{coupon.code}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">{coupon.discount}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">Rs. {coupon.minOrder}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(coupon.expiry).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          coupon.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {coupon.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => deleteCoupon(coupon._id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          title="Delete Coupon"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Offers;
