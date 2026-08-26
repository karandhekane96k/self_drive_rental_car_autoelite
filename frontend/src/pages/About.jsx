import { FaCar, FaShieldAlt, FaAward, FaEye } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="flex flex-col min-h-screen bg-white relative">
      
      {/* Premium Hero Banner */}
      <div 
        className="relative w-full h-[50vh] min-h-[400px] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=2070&auto=format&fit=crop')` }}
      >
        {/* Dark Overlay: Ensures the transparent navbar and banner text are highly visible */}
        <div className="absolute inset-0 bg-black/70"></div>
        
        <div className="relative z-10 text-center px-4 mt-16">
          <h1 className="text-5xl md:text-6xl font-extrabold uppercase tracking-tight text-white mb-4 drop-shadow-lg">
            About <span className="text-red-600">Us</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-300 drop-shadow-md">
            Redefining the self-drive car rental experience with premium vehicles, seamless booking, and unmatched customer service.
          </p>
        </div>
      </div>

      {/* ================= MAIN CONTENT WITH GRID BACKGROUND ================= */}
      <div className="relative w-full flex-grow overflow-hidden">
        
        {/* THE GRID BACKGROUND */}
        <div 
          className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-40" 
          style={{ 
            backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.04) 1px, transparent 1px)', 
            backgroundSize: '40px 40px' 
          }}
        ></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          
          {/* SECTION 1: About Nandi Cars & The Curtain Image */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
            
            {/* Left Side: About Text */}
            <div>
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Who We Are</h2>
              <h3 className="text-4xl font-extrabold text-gray-900 uppercase tracking-tight mb-6">
                The <span className="text-red-600">Nandi Cars</span> Experience
              </h3>
              <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                Founded with an unwavering passion for automotive excellence, NANDI CARS is more than just a rental service. We are your gateway to the open road. We provide a meticulously maintained fleet of self-drive cars that cater to all your travel needs—from luxury business trips to rugged weekend getaways.
              </p>
              <p className="text-gray-600 leading-relaxed mb-10 text-lg">
                Our platform is engineered from the ground up to remove the friction from traditional car rentals. With our streamlined booking process, fully transparent pricing, and instant confirmations, you can get behind the wheel of your dream car in minutes, not hours.
              </p>
              <Link to="/fleet" className="bg-gray-900 hover:bg-red-600 text-white font-bold py-4 px-10 rounded-lg uppercase tracking-widest transition-colors duration-300 inline-block shadow-lg hover:shadow-xl">
                Explore Our Fleet
              </Link>
            </div>

            {/* Right Side: The Revealing Curtain Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl group h-[450px] w-full cursor-pointer bg-gray-900">
              
              {/* The Actual Image (Zooms slightly when revealed) */}
              <img 
                src="https://images.unsplash.com/photo-1485291571150-772bcfc10da5?q=80&w=2000&auto=format&fit=crop" 
                alt="Luxury car driving" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-in-out group-hover:scale-110 z-0"
              />
              
              {/* THE CURTAIN: Slides down and fades out on hover */}
              <div className="absolute inset-0 bg-gray-900 flex flex-col items-center justify-center z-10 transition-all duration-700 ease-in-out origin-top group-hover:translate-y-[100%] group-hover:opacity-0">
                <FaEye className="text-red-600 text-6xl mb-6 animate-pulse" />
                <h4 className="text-white text-2xl font-bold uppercase tracking-widest">Hover to Reveal</h4>
                <p className="text-gray-400 text-sm mt-2">Unleash the journey</p>
              </div>

            </div>
          </div>

          {/* SECTION 2: Our Mission (Powerful Centered Block) */}
          <div className="max-w-4xl mx-auto text-center bg-white/80 backdrop-blur-md p-12 rounded-2xl shadow-xl border border-gray-100 mb-24">
            <h2 className="text-3xl font-extrabold text-gray-900 uppercase tracking-tight mb-6">
              Our <span className="text-red-600">Mission</span>
            </h2>
            <p className="text-gray-600 leading-relaxed text-xl italic font-light">
              "At NANDI CARS, we believe that the journey is just as important as the destination. Our mission is to empower travelers with absolute freedom, offering world-class vehicles and uncompromising safety so you can focus on creating unforgettable memories on the road."
            </p>
          </div>

          {/* SECTION 3: Core Values */}
          <div>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-gray-900 uppercase tracking-tight">
                Why <span className="text-red-600">Choose Us</span>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/90 backdrop-blur-sm p-10 border border-gray-100 shadow-lg rounded-xl text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
                <div className="bg-gray-50 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 group-hover:bg-red-50 transition-colors">
                  <FaCar className="text-gray-900 group-hover:text-red-600 text-3xl transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 uppercase tracking-wider">Premium Fleet</h3>
                <p className="text-gray-500 text-sm leading-relaxed">Every vehicle in our collection is rigorously inspected and sanitized to ensure peak performance and uncompromising safety.</p>
              </div>
              
              <div className="bg-white/90 backdrop-blur-sm p-10 border border-gray-100 shadow-lg rounded-xl text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
                <div className="bg-gray-50 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 group-hover:bg-red-50 transition-colors">
                  <FaShieldAlt className="text-gray-900 group-hover:text-red-600 text-3xl transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 uppercase tracking-wider">Secure & Transparent</h3>
                <p className="text-gray-500 text-sm leading-relaxed">No hidden fees, strict data encryption, and crystal-clear rental agreements you can trust from start to finish.</p>
              </div>
              
              <div className="bg-white/90 backdrop-blur-sm p-10 border border-gray-100 shadow-lg rounded-xl text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
                <div className="bg-gray-50 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 group-hover:bg-red-50 transition-colors">
                  <FaAward className="text-gray-900 group-hover:text-red-600 text-3xl transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 uppercase tracking-wider">Top-Tier Support</h3>
                <p className="text-gray-500 text-sm leading-relaxed">Our dedicated support team is available around the clock to assist you before, during, and long after your trip concludes.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}