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
  FaSignOutAlt 
} from 'react-icons/fa';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // 1. Create a reference for the dropdown container
  const dropdownRef = useRef(null);

  // 2. Add the "Click Outside" listener
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If menu is open and click is outside the dropdown reference, close it
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    // Attach the listener
    document.addEventListener('mousedown', handleClickOutside);
    
    // Clean up listener when component closes
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <nav className="bg-gray-900 md:bg-transparent text-white absolute w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="text-2xl font-bold uppercase tracking-widest">
                <span className="text-red-500">Nandi</span> Cars
              </Link>
            </div>

            {/* Center Navigation Links */}
            <div className="hidden md:flex space-x-8 items-center">
              <Link to="/" className="hover:text-red-500 transition-colors font-medium">Home</Link>
              <Link to="/fleet" className="hover:text-red-500 transition-colors font-medium">Our Fleet</Link>
              <Link to="/about" className="hover:text-red-500 transition-colors font-medium">About Us</Link>
              <Link to="/contact" className="hover:text-red-500 transition-colors font-medium">Contact</Link>
            </div>

            {/* Right Side: Admin & User Section */}
            <div className="flex items-center space-x-4">
              
              {/* Conditional Admin Link (Hidden on mobile via 'hidden md:block') */}
              {user && user.isAdmin && (
                <Link to="/admin/dashboard" className="hidden md:block bg-red-600/10 text-red-500 border border-red-500/30 px-3 py-1 rounded-sm text-sm font-bold hover:bg-red-600 hover:text-white transition-all mr-2">
                  Admin Panel
                </Link>
              )}

              {/* Dynamic Login / User Dropdown Section */}
              {user ? (
                // Attach the ref right here to the wrapping div
                <div className="relative" ref={dropdownRef}>
                  
                  {/* Dropdown Trigger Button */}
                  <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center space-x-2 text-gray-300 hover:text-white focus:outline-none transition-colors px-2 py-1"
                  >
                    <FaUserCircle className="text-2xl text-red-500" />
                    <span className="font-bold hidden sm:block">{user.name}</span>
                    <FaCaretDown className={`transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Floating Dropdown Menu */}
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-4 w-56 bg-white rounded-md shadow-xl py-2 z-50 border border-gray-200 text-gray-800">
                      
                      {/* User Header */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Signed in as</p>
                        <p className="text-sm font-bold text-gray-900 truncate">{user.email || 'User'}</p>
                      </div>
                      
                      {/* Mobile Admin Link (Only shows on mobile via 'md:hidden') */}
                      {user.isAdmin && (
                        <div className="py-1 border-b border-gray-100 md:hidden">
                          <Link to="/admin/dashboard" onClick={() => setIsMenuOpen(false)} className="flex items-center px-4 py-2 text-sm text-red-600 font-bold hover:bg-red-50 transition-colors">
                            <FaCog className="mr-3 text-red-500" /> Admin Panel
                          </Link>
                        </div>
                      )}

                      {/* Personal Links */}
                      <div className="py-1">
                        <Link to="/my-bookings" onClick={() => setIsMenuOpen(false)} className="flex items-center px-4 py-2 text-sm hover:bg-red-50 hover:text-red-600 transition-colors">
                          <FaSuitcase className="mr-3 text-gray-400" /> My Bookings
                        </Link>
                      </div>

                      {/* Account Settings & Help */}
                      <div className="py-1 border-t border-gray-100">
                        <Link to="/help" onClick={() => setIsMenuOpen(false)} className="flex items-center px-4 py-2 text-sm hover:bg-red-50 hover:text-red-600 transition-colors">
                          <FaQuestionCircle className="mr-3 text-gray-400" /> Help & Support
                        </Link>
                        <Link to="/settings" onClick={() => setIsMenuOpen(false)} className="flex items-center px-4 py-2 text-sm hover:bg-red-50 hover:text-red-600 transition-colors">
                          <FaCog className="mr-3 text-gray-400" /> Account Settings
                        </Link>
                      </div>

                      {/* Logout Button */}
                      <div className="py-1 border-t border-gray-100">
                        <button 
                          onClick={() => {
                            setIsMenuOpen(false);
                            logout();
                          }}
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

          </div>
        </div>
      </nav>

      {/* Render the popup globally from the Navbar */}
      {showLoginPopup && <WelcomePopup onClose={() => setShowLoginPopup(false)} />}
    </>
  );
}