import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Brand Section */}
          <div>
            <h2 className="text-2xl font-bold uppercase tracking-widest mb-4">
              <span className="text-red-500">Nandi</span> Cars
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Premium car services and luxury rentals. Experience perfection on every journey with our top-tier fleet and dedicated customer support.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-200">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/about" className="hover:text-red-500 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-red-500 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-200">Contact Us</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Email: nandiselfcars@gmail.com</li>
              <li>Phone: +91 8625881282</li>
              <li>Address: Wakad, PCMC Pune, Maharashtra</li>
            </ul>
          </div>

        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Nandi Cars. All rights reserved.
        </div>
      </div>
    </footer>
  );
}