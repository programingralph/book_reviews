import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSignInAlt, FaUserPlus, FaSearch, FaMoon, FaSun, FaBars } from 'react-icons/fa';

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <header className={`px-6 py-4 flex items-center justify-between ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-teal-950 shadow-md text-yellow-500'}`}>
      {/* Left: Logo or Menu Toggle */}
      <div className="flex items-center space-x-4">
        <button onClick={toggleMobileMenu} className="md:hidden text-xl">
          <FaBars />
        </button>
        <button onClick={toggleTheme} className="text-xl">
          {isDarkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div>

      {/* Center: Search Bar */}
      <div className="flex-grow mx-6 hidden md:block">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search reviews..."
            className={`w-full pl-10 border rounded px-4 py-2 focus:outline-none transition-all duration-300 ${
              isDarkMode
                ? 'bg-gray-800 text-white border-gray-600 focus:ring-2 focus:ring-blue-300'
                : 'bg-white border-gray-300 focus:ring-2 focus:ring-blue-400'
            }`}
          />
        </div>
      </div>

      {/* Right: Auth Links */}
      <div className="hidden md:flex space-x-4 items-center">
        <Link to="/login" className="flex items-center space-x-1 hover:underline">
          <FaSignInAlt />
          <span>Sign In</span>
        </Link>
        <Link to="/register" className="flex items-center space-x-1 hover:underline">
          <FaUserPlus />
          <span>Sign Up</span>
        </Link>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-800 px-6 py-4 shadow-md md:hidden z-50">
          <div className="flex flex-col space-y-2">
            <Link to="/login" className="flex items-center space-x-1 hover:underline">
              <FaSignInAlt />
              <span>Sign In</span>
            </Link>
            <Link to="/signup" className="flex items-center space-x-1 hover:underline">
              <FaUserPlus />
              <span>Sign Up</span>
            </Link>
            <input
              type="text"
              placeholder="Search..."
              className={`mt-2 px-4 py-2 rounded border ${
                isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'
              }`}
            />
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;