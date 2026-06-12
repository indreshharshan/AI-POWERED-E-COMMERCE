import logo from "../assets/logo.png";
import cart_icon from "../assets/cart_icon.png";
import offers_icon from "../assets/offers_icon.png";
import order_icon from "../assets/order_icon.png";
import { FaUser } from "react-icons/fa";
import { useEffect, useState, useContext } from "react";
import { ShopContext } from "../Context/ShopContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { RiCloseLargeFill } from "react-icons/ri";
import { FaBars, FaCamera } from "react-icons/fa6";
import VisualSearchModal from "./VisualSearchModal";

const Navbar = () => {
  const [menu, setmenu] = useState();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isVisualSearchOpen, setIsVisualSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { getTotalCartItems, searchQuery, setSearchQuery } = useContext(ShopContext);
  const totalCartItems = getTotalCartItems();
  const isLoggedIn = !!localStorage.getItem("auth-token");

  useEffect(() => {
    if (location.pathname === "/") {
      setmenu("shop");
    } else if (location.pathname === "/collections") {
      setmenu("collections");
    } else {
      setmenu("");
    }
  }, [location.pathname]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("auth-token");
    navigate("/");
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">

            {/* ── Logo ── */}
            <Link to="/" className="flex items-center space-x-2 shrink-0">
              <img src={logo} alt="Shopper Logo" className="h-10 w-auto" />
              <span className="text-xl font-semibold text-gray-800">Shopper</span>
            </Link>

            {/* ── Desktop Centre: Shop | Search | Collections ── */}
            <div className="hidden md:flex items-center flex-1 gap-4 justify-center">
              {/* Shop */}
              <div className={`p-1 ${menu === "shop" ? "text-red-500 border-b-4 border-red-500" : ""}`}>
                <Link
                  to="/"
                  onClick={() => setmenu("shop")}
                  className="text-gray-600 hover:text-red-500 transition-colors duration-200 font-medium text-sm"
                >
                  Shop
                </Link>
              </div>

              {/* Search bar */}
              <div className="flex-1 max-w-sm">
                <div className="relative flex items-center w-full h-10 rounded-full bg-gray-100 overflow-hidden focus-within:shadow-lg">
                  <div className="grid place-items-center h-full w-12 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    className="peer h-full w-full outline-none text-sm text-gray-700 pr-2 bg-transparent"
                    type="text"
                    id="search"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (location.pathname !== "/collections" && e.target.value !== "") {
                        navigate("/collections");
                      }
                    }}
                  />
                  <button
                    onClick={() => setIsVisualSearchOpen(true)}
                    className="p-2 mr-1 text-gray-400 hover:text-red-500 transition-colors"
                    title="Search by image"
                  >
                    <FaCamera />
                  </button>
                </div>
              </div>

              {/* Collections */}
              <div className={`p-1 ${menu === "collections" ? "text-red-500 border-b-4 border-red-500" : ""}`}>
                <Link
                  to="/collections"
                  onClick={() => setmenu("collections")}
                  className="text-gray-600 hover:text-red-500 transition-colors duration-200 font-medium text-sm"
                >
                  Collections
                </Link>
              </div>
            </div>

            {/* ── Desktop Right: Offers | Orders | Cart | Login ── */}
            <div className="hidden md:flex items-center gap-5 shrink-0">

              {/* Offers */}
              <Link to="/offers" title="Offers" className="hover:opacity-70 transition-opacity">
                <img src={offers_icon} alt="Offers" className="h-6 w-6" />
              </Link>

              {/* Orders – only when logged in */}
              {isLoggedIn && (
                <Link to="/orders" title="Orders" className="hover:opacity-70 transition-opacity">
                  <img src={order_icon} alt="Orders" className="h-6 w-6" />
                </Link>
              )}

              {/* Cart */}
              <Link to="/cart" title="Cart" className="relative hover:opacity-70 transition-opacity">
                <img src={cart_icon} alt="Cart" className="h-6 w-6" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {totalCartItems}
                  </span>
                )}
              </Link>

              {/* Login / Logout */}
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors duration-200"
                >
                  <FaUser size={14} />
                  <span>Logout</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors duration-200"
                >
                  <FaUser size={14} />
                  <span>Login</span>
                </Link>
              )}
            </div>

            {/* ── Mobile: Hamburger ── */}
            <div className="md:hidden flex items-center">
              <button onClick={toggleSidebar} aria-label="Open menu">
                <FaBars size={24} className="text-gray-600" />
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm bg-black/30 z-50 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-800">Menu</h2>
            <button onClick={closeSidebar} className="text-gray-600 hover:text-red-500 transition-colors duration-200">
              <RiCloseLargeFill size={24} />
            </button>
          </div>

          {/* Mobile Search */}
          <div className="px-6 pt-6">
            <div className="relative flex items-center w-full h-10 rounded-full bg-gray-100 overflow-hidden focus-within:shadow-lg">
              <div className="grid place-items-center h-full w-12 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                className="peer h-full w-full outline-none text-sm text-gray-700 pr-2 bg-transparent"
                type="text"
                id="search-mobile"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (location.pathname !== "/collections" && e.target.value !== "") {
                    navigate("/collections");
                  }
                }}
              />
            </div>
          </div>

          {/* Mobile Nav Links */}
          <div className="flex-1 py-6 overflow-y-auto">
            <div className="space-y-1">
              <Link
                to="/"
                onClick={() => { setmenu("shop"); closeSidebar(); }}
                className={`block px-6 py-3 text-base font-medium transition-colors duration-200 ${
                  menu === "shop" ? "text-red-500 bg-red-50 border-r-4 border-red-500" : "text-gray-600 hover:text-red-500 hover:bg-gray-50"
                }`}
              >
                Shop
              </Link>
              <Link
                to="/collections"
                onClick={() => { setmenu("collections"); closeSidebar(); }}
                className={`block px-6 py-3 text-base font-medium transition-colors duration-200 ${
                  menu === "collections" ? "text-red-500 bg-red-50 border-r-4 border-red-500" : "text-gray-600 hover:text-red-500 hover:bg-gray-50"
                }`}
              >
                Collections
              </Link>
              <Link
                to="/offers"
                onClick={closeSidebar}
                className="block px-6 py-3 text-base font-medium text-gray-600 hover:text-red-500 hover:bg-gray-50 transition-colors duration-200"
              >
                Offers
              </Link>
              {isLoggedIn && (
                <Link
                  to="/orders"
                  onClick={closeSidebar}
                  className="block px-6 py-3 text-base font-medium text-gray-600 hover:text-red-500 hover:bg-gray-50 transition-colors duration-200"
                >
                  Orders
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Footer */}
          <div className="p-6 border-t space-y-3">
            <Link
              to="/cart"
              onClick={closeSidebar}
              className="flex items-center justify-center gap-2 w-full border border-gray-300 px-6 py-3 rounded-full hover:bg-gray-50 transition-colors duration-200 font-medium text-gray-700"
            >
              <img src={cart_icon} alt="Cart" className="h-5 w-5" />
              <span>Cart {totalCartItems > 0 && `(${totalCartItems})`}</span>
            </Link>

            {isLoggedIn ? (
              <button
                onClick={() => { handleLogout(); closeSidebar(); }}
                className="flex items-center justify-center gap-2 w-full bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600 transition-colors duration-200 font-medium"
              >
                <FaUser size={14} />
                <span>Logout</span>
              </button>
            ) : (
              <Link
                to="/login"
                onClick={closeSidebar}
                className="flex items-center justify-center gap-2 w-full bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600 transition-colors duration-200 font-medium"
              >
                <FaUser size={14} />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      <VisualSearchModal
        isOpen={isVisualSearchOpen}
        onClose={() => setIsVisualSearchOpen(false)}
      />
    </>
  );
};

export default Navbar;
