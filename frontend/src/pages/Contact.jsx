import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaWhatsapp } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function Contact() {
  
  const handleContactSubmit = (e) => {
    e.preventDefault();
    toast.success('Message sent successfully! Our team will contact you soon.');
    e.target.reset();
  };

  // Pre-filled WhatsApp message handler
  const handleWhatsAppClick = () => {
    const phoneNumber = "918625881282"; // Replace with your actual WhatsApp business number
    const message = encodeURIComponent("Hello Nandi Cars, I need help with renting a car / general inquiry.");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="flex flex-col min-h-screen bg-white relative">
      
      {/* Premium Hero Banner */}
      <div 
        className="relative w-full h-[50vh] min-h-[400px] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?q=80&w=2052&auto=format&fit=crop')` }}
      >
        {/* Dark Overlay for transparent navbar visibility */}
        <div className="absolute inset-0 bg-black/70"></div>
        
        <div className="relative z-10 text-center px-4 mt-16">
          <h1 className="text-5xl md:text-6xl font-extrabold uppercase tracking-tight text-white mb-4 drop-shadow-lg">
            Contact <span className="text-red-600">Us</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-300 drop-shadow-md">
            Have a question or need support? Reach out instantly via phone, WhatsApp, or email.
          </p>
        </div>
      </div>

      {/* ================= MAIN CONTENT WITH GRID BACKGROUND ================= */}
      <div className="relative w-full flex-grow py-20">
        
        {/* THE MAIN WHITE BACKGROUND GRID */}
        <div 
          className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-40" 
          style={{ 
            backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.04) 1px, transparent 1px)', 
            backgroundSize: '40px 40px' 
          }}
        ></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          
          <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">
            
            {/* Contact Information Panel */}
            <div className="bg-gray-900 text-white p-10 md:p-14 md:w-2/5 flex flex-col justify-between relative overflow-hidden">
              
              {/* Subtle Light Grid for the Dark Panel */}
              <div 
                className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-20" 
                style={{ 
                  backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)', 
                  backgroundSize: '40px 40px' 
                }}
              ></div>

              <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-red-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

              <div className="relative z-10">
                <h2 className="text-3xl font-bold uppercase tracking-wide mb-4">Get In Touch</h2>
                <p className="text-gray-400 text-sm mb-10 leading-relaxed">
                  Connect with our team directly for immediate assistance with bookings or vehicle support.
                </p>
                
                <div className="space-y-8">
                  {/* Headquarters */}
                  <div className="flex items-start gap-5">
                    <div className="flex-shrink-0 bg-gray-800 p-3.5 rounded-full border border-gray-700">
                      <FaMapMarkerAlt className="text-red-500 text-xl" />
                    </div>
                    <div className="pt-1">
                      <h3 className="font-bold uppercase text-xs text-gray-300 tracking-widest">Headquarters</h3>
                      <p className="text-white text-sm mt-1.5 leading-relaxed">Wakad, PCMC<br />Pune, Maharashtra</p>
                    </div>
                  </div>
                  
                  {/* Phone */}
                  <div className="flex items-start gap-5">
                    <div className="flex-shrink-0 bg-gray-800 p-3.5 rounded-full border border-gray-700">
                      <FaPhone className="text-red-500 text-xl" />
                    </div>
                    <div className="pt-1">
                      <h3 className="font-bold uppercase text-xs text-gray-300 tracking-widest">Phone</h3>
                      <a href="tel:+918625881282" className="text-white hover:text-red-400 text-sm mt-1.5 block transition-colors font-medium">
                        +91 862-588-1282
                      </a>
                    </div>
                  </div>

                  {/* WhatsApp */}
                  <div className="flex items-start gap-5 group cursor-pointer" onClick={handleWhatsAppClick}>
                    <div className="flex-shrink-0 bg-gray-800 group-hover:bg-green-900/40 p-3.5 rounded-full border border-gray-700 transition-colors">
                      <FaWhatsapp className="text-green-500 text-xl" />
                    </div>
                    <div className="pt-1">
                      <h3 className="font-bold uppercase text-xs text-gray-300 tracking-widest">WhatsApp Chat</h3>
                      <span className="text-green-400 group-hover:text-green-300 text-sm mt-1.5 block font-medium transition-colors">
                        Chat with us instantly &rarr;
                      </span>
                    </div>
                  </div>
                  
                  {/* Email */}
                  <div className="flex items-start gap-5">
                    <div className="flex-shrink-0 bg-gray-800 p-3.5 rounded-full border border-gray-700">
                      <FaEnvelope className="text-red-500 text-xl" />
                    </div>
                    <div className="pt-1">
                      <h3 className="font-bold uppercase text-xs text-gray-300 tracking-widest">Email</h3>
                      <a href="mailto:nandiselfcars@gmail.com" className="text-white hover:text-red-400 text-sm mt-1.5 block transition-colors font-medium">
                        nandiselfcars@gmail.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form Panel */}
            <div className="p-10 md:p-14 md:w-3/5 bg-white relative overflow-hidden">
              
              {/* NEW: The Grid Background for the white form section */}
              <div 
                className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-40" 
                style={{ 
                  backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.04) 1px, transparent 1px)', 
                  backgroundSize: '40px 40px' 
                }}
              ></div>

              {/* Form Content Wrapper (z-10 ensures inputs stay above the grid) */}
              <div className="relative z-10">
                <h2 className="text-3xl font-extrabold text-gray-900 uppercase tracking-tight mb-8">
                  Send a <span className="text-red-600">Message</span>
                </h2>
                
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-gray-500 mb-2 tracking-widest">Full Name</label>
                      <input type="text" required placeholder="John Doe" className="w-full bg-white/70 backdrop-blur-sm border border-gray-200 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm transition-all" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-gray-500 mb-2 tracking-widest">Email Address</label>
                      <input type="email" required placeholder="john@example.com" className="w-full bg-white/70 backdrop-blur-sm border border-gray-200 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm transition-all" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-gray-500 mb-2 tracking-widest">Subject</label>
                    <input type="text" required placeholder="How can we help you?" className="w-full bg-white/70 backdrop-blur-sm border border-gray-200 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm transition-all" />
                  </div>
                  
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-gray-500 mb-2 tracking-widest">Message</label>
                    <textarea required rows="4" placeholder="Write your message here..." className="w-full bg-white/70 backdrop-blur-sm border border-gray-200 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm transition-all resize-none"></textarea>
                  </div>
                  
                  <button type="submit" className="w-full bg-gray-900 hover:bg-red-600 text-white font-bold py-4 px-10 rounded-lg uppercase tracking-widest transition-colors duration-300 shadow-md hover:shadow-lg mt-2 cursor-pointer">
                    Send Message
                  </button>
                </form>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}