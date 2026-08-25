import { FaCar, FaShieldAlt, FaAward } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gray-900 text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold uppercase tracking-tight mb-4">
          About <span className="text-red-600">NANDI CARS</span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          Redefining the self-drive car rental experience with premium vehicles, seamless booking, and unmatched customer service.
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 uppercase tracking-tight mb-6">
              Our <span className="text-red-600">Mission</span>
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              At NANDI CARS, we believe that the journey is just as important as the destination. Founded with a passion for automotive excellence, we provide a meticulously maintained fleet of self-drive cars that cater to all your travel needs—from luxury business trips to rugged weekend getaways.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              Our platform is engineered to remove the friction from car rentals. With our streamlined booking process, transparent pricing, and instant confirmations, you can get behind the wheel of your dream car in minutes.
            </p>
            <Link to="/fleet" className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-sm uppercase tracking-widest transition-colors inline-block shadow-lg">
              Explore Our Fleet
            </Link>
          </div>
          <div className="rounded-sm overflow-hidden shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1485291571150-772bcfc10da5?q=80&w=2000&auto=format&fit=crop" 
              alt="Luxury car driving" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="bg-gray-50 py-16 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 border border-gray-100 shadow-sm rounded-sm text-center hover:shadow-md transition-shadow">
              <FaCar className="text-red-600 text-5xl mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3 uppercase">Premium Fleet</h3>
              <p className="text-gray-500 text-sm">Every vehicle in our collection is rigorously inspected and sanitized to ensure peak performance and safety.</p>
            </div>
            <div className="bg-white p-8 border border-gray-100 shadow-sm rounded-sm text-center hover:shadow-md transition-shadow">
              <FaShieldAlt className="text-red-600 text-5xl mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3 uppercase">Secure & Transparent</h3>
              <p className="text-gray-500 text-sm">No hidden fees, strict data encryption, and transparent rental agreements you can trust.</p>
            </div>
            <div className="bg-white p-8 border border-gray-100 shadow-sm rounded-sm text-center hover:shadow-md transition-shadow">
              <FaAward className="text-red-600 text-5xl mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3 uppercase">Top-Tier Support</h3>
              <p className="text-gray-500 text-sm">Our dedicated support team is available around the clock to assist you before, during, and after your trip.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}