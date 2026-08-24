import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import WelcomePopup from './WelcomePopup'; 

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  return (
    <>
      <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="text-2xl font-bold uppercase tracking-widest">
                <span className="text-red-500">Auto</span>Elite
              </Link>
            </div>

            {/* Center Navigation Links */}
            <div className="hidden md:flex space-x-8">
              <Link to="/" className="hover:text-red-500 transition-colors">Home</Link>
              <Link to="/fleet" className="hover:text-red-500 transition-colors">Our Fleet</Link>
              <Link to="/about" className="hover:text-red-500 transition-colors">About Us</Link>
              <Link to="/contact" className="hover:text-red-500 transition-colors">Contact</Link>
            </div>

            {/* NEW: Conditional Admin Link */}
              {user && user.isAdmin && (
                <Link to="/admin/dashboard" className="bg-red-600/10 text-red-500 border border-red-500/30 px-3 py-1 rounded-sm text-sm font-bold hover:bg-red-600 hover:text-white transition-all">
                  Admin Panel
                </Link>
              )}

            {/* Dynamic Login / User Section */}
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-300 text-sm md:text-base">
                    Welcome, <span className="font-bold text-white">{user.name}</span>!
                  </span>
                  <button 
                    onClick={logout}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-sm text-sm font-bold transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setShowLoginPopup(true)} 
                  className="bg-white text-gray-900 hover:bg-gray-200 px-6 py-2 rounded-sm text-sm font-bold transition-colors"
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