import { useContext, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import WelcomePopup from './WelcomePopup'; 
import { 
  FaUserCircle, 
  FaCaretDown, 
  FaSuitcase, 
  FaQuestionCircle, 
  FaCog, 
  FaSignOutAlt,
  FaBars,
  FaTimes
} from 'react-icons/fa';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  
  // State for Desktop Dropdown & Mobile Menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const dropdownRef = useRef(null);

  // Close Mobile Menu helper function
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // Add the "Click Outside" listener with the Swiper bypass (pointerdown) for Desktop
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If desktop menu is open and click is outside the dropdown reference, close it
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('pointerdown', handleClickOutside, true);
    document.addEventListener('touchstart', handleClickOutside, true);
    
    return () => {
      document.removeEventListener('pointerdown', handleClickOutside, true);
      document.removeEventListener('touchstart', handleClickOutside, true);
    };
  }, []);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav className="bg-gray-900 md:bg-transparent text-white absolute w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo */}
            <div className="flex-shrink-0 z-50">
              <Link to="/" className="text-2xl font-bold uppercase tracking-widest" onClick={closeMobileMenu}>
                <span className="text-red-500">Nandi</span> Cars
              </Link>
            </div>

            {/* ================= DESKTOP NAVIGATION ================= */}
            
            {/* Center Navigation Links (Hidden on Mobile) */}
            <div className="hidden md:flex space-x-8 items-center">
              <Link to="/" className="hover:text-red-500 transition-colors font-medium">Home</Link>
              <Link to="/fleet" className="hover:text-red-500 transition-colors font-medium">Our Fleet</Link>
              <Link to="/about" className="hover:text-red-500 transition-colors font-medium">About Us</Link>
              <Link to="/contact" className="hover:text-red-500 transition-colors font-medium">Contact</Link>
            </div>

            {/* Right Side: Admin & User Section (Hidden on Mobile) */}
            <div className="hidden md:flex items-center space-x-4">
              
              {user && user.isAdmin && (
                <Link to="/admin/dashboard" className="bg-red-600/10 text-red-500 border border-red-500/30 px-3 py-1 rounded-sm text-sm font-bold hover:bg-red-600 hover:text-white transition-all mr-2">
                  Admin Panel
                </Link>
              )}

              {user ? (
                <div 
                  className="relative pb-2 pt-2" 
                  ref={dropdownRef}
                  onMouseEnter={() => setIsMenuOpen(true)}
                  onMouseLeave={() => setIsMenuOpen(false)}
                >
                  <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)} 
                    className="flex items-center space-x-2 text-gray-300 hover:text-white focus:outline-none transition-colors px-2 py-1"
                  >
                    <FaUserCircle className="text-2xl text-red-500" />
                    <span className="font-bold hidden sm:block">{user.name}</span>
                    <FaCaretDown className={`transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-xl py-2 z-50 border border-gray-200 text-gray-800">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Signed in as</p>
                        <p className="text-sm font-bold text-gray-900 truncate">{user.email}</p>
                      </div>
                      
                      <div className="py-1">
                        <Link to="/my-bookings" onClick={() => setIsMenuOpen(false)} className="flex items-center px-4 py-2 text-sm hover:bg-red-50 hover:text-red-600 transition-colors">
                          <FaSuitcase className="mr-3 text-gray-400" /> My Bookings
                        </Link>
                      </div>

                      <div className="py-1 border-t border-gray-100">
                        <Link to="/help" onClick={() => setIsMenuOpen(false)} className="flex items-center px-4 py-2 text-sm hover:bg-red-50 hover:text-red-600 transition-colors">
                          <FaQuestionCircle className="mr-3 text-gray-400" /> Help & Support
                        </Link>
                        <Link to="/settings" onClick={() => setIsMenuOpen(false)} className="flex items-center px-4 py-2 text-sm hover:bg-red-50 hover:text-red-600 transition-colors">
                          <FaCog className="mr-3 text-gray-400" /> Account Settings
                        </Link>
                      </div>

                      <div className="py-1 border-t border-gray-100">
                        <button 
                          onClick={() => { setIsMenuOpen(false); logout(); }}
                          className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-bold"
                        >
                          <FaSignOutAlt className="mr-3" /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button 
                  onClick={() => setShowLoginPopup(true)} 
                  className="bg-red-600 text-white hover:bg-red-700 px-6 py-2 rounded-sm text-sm font-bold transition-colors shadow-md"
                >
                  Login / Sign Up
                </button>
              )}
            </div>

            {/* ================= MOBILE HAMBURGER BUTTON ================= */}
            <div className="md:hidden flex items-center z-50">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-300 hover:text-white focus:outline-none p-2"
              >
                {isMobileMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* ================= MOBILE SLIDE-IN MENU ================= */}
      
      {/* Dark Overlay Background */}
      <div 
        className={`fixed inset-0 bg-black/70 z-[60] md:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={closeMobileMenu}
      ></div>

      {/* Sliding Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-3/4 max-w-sm bg-gray-900 text-white z-[70] md:hidden flex flex-col shadow-2xl transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Drawer Header Space (To clear the physical logo/button space) */}
        <div className="h-20 border-b border-gray-800"></div>

        {/* Drawer Links */}
        <div className="flex flex-col py-6 px-6 overflow-y-auto h-full">
          
          <div className="space-y-6 flex flex-col mb-8">
            <Link to="/" onClick={closeMobileMenu} className="text-lg font-medium hover:text-red-500 transition-colors">Home</Link>
            <Link to="/fleet" onClick={closeMobileMenu} className="text-lg font-medium hover:text-red-500 transition-colors">Our Fleet</Link>
            <Link to="/about" onClick={closeMobileMenu} className="text-lg font-medium hover:text-red-500 transition-colors">About Us</Link>
            <Link to="/contact" onClick={closeMobileMenu} className="text-lg font-medium hover:text-red-500 transition-colors">Contact</Link>
          </div>

          <hr className="border-gray-800 mb-8" />

          {/* Mobile Auth Section */}
          {user ? (
            <div className="flex flex-col space-y-5">
              {/* Profile Header */}
              <div className="flex items-center space-x-3 mb-2">
                <FaUserCircle className="text-4xl text-red-500" />
                <div>
                  <p className="font-bold text-white">{user.name}</p>
                  <p className="text-xs text-gray-400 truncate w-40">{user.email}</p>
                </div>
              </div>

              {user.isAdmin && (
                <Link to="/admin/dashboard" onClick={closeMobileMenu} className="flex items-center text-red-500 font-bold">
                  <FaCog className="mr-3" /> Admin Panel
                </Link>
              )}
              
              <Link to="/my-bookings" onClick={closeMobileMenu} className="flex items-center text-gray-300 hover:text-white transition-colors">
                <FaSuitcase className="mr-3 text-gray-500" /> My Bookings
              </Link>
              <Link to="/help" onClick={closeMobileMenu} className="flex items-center text-gray-300 hover:text-white transition-colors">
                <FaQuestionCircle className="mr-3 text-gray-500" /> Help & Support
              </Link>
              <Link to="/settings" onClick={closeMobileMenu} className="flex items-center text-gray-300 hover:text-white transition-colors">
                <FaCog className="mr-3 text-gray-500" /> Account Settings
              </Link>
              
              <button 
                onClick={() => { logout(); closeMobileMenu(); }}
                className="flex items-center text-red-500 hover:text-red-400 font-bold pt-4"
              >
                <FaSignOutAlt className="mr-3" /> Logout
              </button>
            </div>
          ) : (
            <button 
              onClick={() => { setShowLoginPopup(true); closeMobileMenu(); }} 
              className="bg-red-600 text-white hover:bg-red-700 py-3 rounded-sm text-center font-bold transition-colors shadow-md w-full"
            >
              Login / Sign Up
            </button>
          )}

        </div>
      </div>

      {/* Render the popup globally from the Navbar */}
      {showLoginPopup && <WelcomePopup onClose={() => setShowLoginPopup(false)} />}
    </>
  );
}