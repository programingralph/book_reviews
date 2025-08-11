import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaSignInAlt, FaUserPlus, FaSearch, FaMoon, FaSun, FaBars, FaTimes } from 'react-icons/fa';

function HomeNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const mobileMenuRef = useRef(null);

  // Toggle mobile menu
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // Toggle theme and apply to document
  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      document.documentElement.classList.toggle('dark', newMode);
      return newMode;
    });
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      className={`px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-teal-950 text-yellow-500'
      } shadow-md transition-all duration-300`}
    >
      {/* Left: Logo or Menu Toggle */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        <button
          onClick={toggleMobileMenu}
          className="text-xl focus:outline-none md:hidden"
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
        <button
          onClick={toggleTheme}
          className="text-xl focus:outline-none"
          aria-label="Toggle theme"
        >
          {isDarkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div>
      {/* Right: Auth Links */}
      <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
        <Link
          to="/login"
          className="flex items-center space-x-1 hover:underline focus:outline-none"
        >
          <FaSignInAlt />
          <span>Sign In</span>
        </Link>
        <Link
          to="/register"
          className="flex items-center space-x-1 hover:underline focus:outline-none"
        >
          <FaUserPlus />
          <span>Sign Up</span>
        </Link>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-50 flex items-center justify-center"
        >
          <div
            className={`w-full max-w-md mx-4 p-6 rounded-lg shadow-lg ${
              isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
            }`}
          >
            <div className="flex justify-end">
              <button
                onClick={toggleMobileMenu}
                className="text-xl focus:outline-none"
                aria-label="Close mobile menu"
              >
                <FaTimes />
              </button>
            </div>
            <div className="flex flex-col space-y-4 mt-4">
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-2 hover:underline"
              >
                <FaSignInAlt />
                <span>Sign In</span>
              </Link>
              <Link
                to="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-2 hover:underline"
              >
                <FaUserPlus />
                <span>Sign Up</span>
              </Link>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search reviews..."
                  className={`w-full pl-10 pr-4 py-2 rounded border ${
                    isDarkMode
                      ? 'bg-gray-700 text-white border-gray-600 focus:ring-2 focus:ring-blue-300'
                      : 'bg-white text-gray-900 border-gray-300 focus:ring-2 focus:ring-blue-400'
                  } focus:outline-none`}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default HomeNavbar;