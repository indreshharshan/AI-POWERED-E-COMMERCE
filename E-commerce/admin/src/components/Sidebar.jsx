import { Link, useLocation } from "react-router-dom";
import add_product_icon from "../assets/Product_Cart.svg";
import list_product from "../assets/Product_list_icon.svg";
import { FaChartPie, FaShoppingCart, FaUsers, FaTags } from "react-icons/fa";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: "/dashboard", name: "Dashboard", icon: <FaChartPie className="w-5 h-5" /> },
    { path: "/orders", name: "Orders", icon: <FaShoppingCart className="w-5 h-5" /> },
    { path: "/users", name: "Users", icon: <FaUsers className="w-5 h-5" /> },
    { path: "/addproduct", name: "Add Product", image: add_product_icon },
    { path: "/listproduct", name: "Product List", image: list_product },
    { path: "/offers", name: "Offers & Coupons", icon: <FaTags className="w-5 h-5" /> },
  ];

  return (
    <div className="fixed left-0 top-20 h-[calc(100vh-5rem)] w-16 md:w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col transition-all duration-300 z-40">
      <div className="flex-1 overflow-y-auto">
        {/* Sidebar Header */}
        <div className="px-4 py-6 flex justify-center md:justify-start md:px-6">
          <div className="hidden md:block">
            <h2 className="text-lg font-semibold text-gray-800">Admin</h2>
            <p className="text-sm text-gray-500">Manage your store</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-2 px-2 md:px-3">
          {menuItems.map((item, index) => (
            <Link to={item.path} key={index}>
              <div
                className={`flex items-center justify-center md:justify-start space-x-0 md:space-x-3 px-3 py-3 rounded-lg transition-colors duration-200 group
                ${
                  location.pathname === item.path
                    ? "bg-red-50 text-red-500"
                    : "text-gray-700 hover:bg-gray-50 hover:text-red-500"
                }`}
              >
                <div className="flex-shrink-0 flex items-center justify-center w-6 h-6">
                  {item.icon ? (
                    item.icon
                  ) : (
                    <img src={item.image} alt={item.name} className="w-6 h-6" style={{ filter: location.pathname === item.path ? 'invert(37%) sepia(91%) saturate(2338%) hue-rotate(337deg) brightness(98%) contrast(98%)' : 'none' }} />
                  )}
                </div>
                <p className="hidden md:block text-sm font-medium">{item.name}</p>
                {location.pathname === item.path && (
                  <div className="w-1 h-8 bg-red-500 absolute right-0 rounded-l-lg"></div>
                )}
              </div>
            </Link>
          ))}
        </nav>
      </div>

      {/* Admin Panel Profile */}
      <div className="border-t border-gray-200 bg-white">
        <div className="p-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer flex justify-center md:justify-start">
          <div className="flex items-center space-x-0 md:space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-red-500 font-bold">A</span>
              </div>
            </div>
            <div className="hidden md:block flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                Admin Panel
              </p>
              <p className="text-xs text-gray-500 truncate">Version 2.0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
