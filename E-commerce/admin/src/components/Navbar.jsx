import navlogo from "../assets/nav-logo.svg";
import navProfile from "../assets/nav-profile.svg";

const Navbar = ({ setToken }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <img
              src={navlogo}
              alt="Logo"
              className="h-12 w-auto hover:opacity-80 transition-opacity duration-200"
            />
          </div>

          {/* Profile Section */}
          <div className="flex items-center">
            <div className=" relative group">
              <button className="flex items-center space-x-3 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
                <img
                  src={navProfile}
                  alt="Profile"
                  className="h-10 w-20   "
                />
                <span className="text-gray-700 font-medium">Admin</span>
              </button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out">
                <a
                  href="#profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Your Profile
                </a>
                <a
                  href="#settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Settings
                </a>
                <hr className="my-1 border-gray-200" />
                <button
                  onClick={() => {
                    localStorage.removeItem("admin-token");
                    if(setToken) setToken("");
                  }}
                  className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
