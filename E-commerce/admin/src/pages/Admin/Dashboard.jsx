import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { FaUsers, FaBoxOpen, FaRupeeSign, FaShoppingCart, FaExclamationTriangle, FaFire } from "react-icons/fa";

// Dummy Data
const salesData = [
  { name: "Jan", sales: 4000 },
  { name: "Feb", sales: 3000 },
  { name: "Mar", sales: 5000 },
  { name: "Apr", sales: 4500 },
  { name: "May", sales: 6000 },
  { name: "Jun", sales: 7000 },
];

const categoryData = [
  { name: 'Men', value: 45 },
  { name: 'Women', value: 35 },
  { name: 'Kids', value: 20 },
];

const COLORS = ['#ef4444', '#3b82f6', '#10b981']; // Red, Blue, Green

const topSelling = [
  { id: 1, name: "Men's Casual Shirt", sales: 124, revenue: "15,000" },
  { id: 2, name: "Women's Summer Dress", sales: 98, revenue: "12,500" },
  { id: 3, name: "Kids T-Shirt", sales: 85, revenue: "4,500" },
];

const lowStock = [
  { id: 1, name: "Premium Leather Wallet", stock: 2, category: "Men" },
  { id: 2, name: "Wireless Earbuds", stock: 0, category: "Electronics" },
  { id: 3, name: "Running Shoes", stock: 4, category: "Women" },
];

const Dashboard = () => {
  return (
    <div className="ml-16 md:ml-64 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold text-gray-800">Overview Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
              <h3 className="text-2xl font-bold text-gray-800">Rs. 45,231</h3>
            </div>
            <div className="h-12 w-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-xl">
              <FaRupeeSign />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Orders</p>
              <h3 className="text-2xl font-bold text-gray-800">1,204</h3>
            </div>
            <div className="h-12 w-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-xl">
              <FaShoppingCart />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Users</p>
              <h3 className="text-2xl font-bold text-gray-800">3,422</h3>
            </div>
            <div className="h-12 w-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-xl">
              <FaUsers />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Products</p>
              <h3 className="text-2xl font-bold text-gray-800">145</h3>
            </div>
            <div className="h-12 w-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-xl">
              <FaBoxOpen />
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sales Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Sales Overview</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#ef4444"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Pie Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Sales by Category</h2>
            <div className="h-64 flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Third Row: Top Selling, Low Stock, Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Top Selling Products */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaFire className="text-orange-500" /> Top Selling
            </h2>
            <div className="space-y-4">
              {topSelling.map((product, i) => (
                <div key={i} className="flex justify-between items-center border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.sales} sold</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-800">Rs. {product.revenue}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Low Stock Alerts */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaExclamationTriangle className="text-yellow-500" /> Low Stock Alert
            </h2>
            <div className="space-y-4">
              {lowStock.map((product, i) => (
                <div key={i} className="flex justify-between items-center border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium text-gray-800 text-sm line-clamp-1">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${
                      product.stock === 0 ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {product.stock === 0 ? 'Out of Stock' : `${product.stock} left`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders List */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h2>
            <div className="space-y-4">
              {[
                { id: "#ORD-001", user: "Rahul T", amount: 1200, status: "Delivered" },
                { id: "#ORD-002", user: "Priya S", amount: 450, status: "Processing" },
                { id: "#ORD-003", user: "Karthik", amount: 3200, status: "Shipped" },
              ].map((order, i) => (
                <div key={i} className="flex justify-between items-center border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{order.user}</p>
                    <p className="text-xs text-gray-500">{order.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-800">Rs. {order.amount}</p>
                    <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'Shipped' ? 'bg-purple-100 text-purple-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
