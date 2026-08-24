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
    const message = encodeURIComponent("Hello AutoElite, I need help with renting a car / general inquiry.");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 uppercase tracking-tight">
            Contact <span className="text-red-600">Us</span>
          </h1>
          <p className="text-gray-500 mt-2">Have a question or need support? Reach out instantly via phone, WhatsApp, or email.</p>
        </div>

        <div className="bg-white shadow-xl rounded-sm overflow-hidden border border-gray-200 flex flex-col md:flex-row">
          
          {/* Contact Information Panel */}
          <div className="bg-gray-900 text-white p-10 md:w-1/3 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold uppercase tracking-wide mb-6">Get In Touch</h2>
              <p className="text-gray-400 text-sm mb-8">
                Connect with our team directly for immediate assistance with bookings or vehicle support.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <FaMapMarkerAlt className="text-red-500 text-xl mr-4 mt-1" />
                  <div>
                    <h3 className="font-bold uppercase text-sm">Headquarters</h3>
                    <p className="text-gray-400 text-sm mt-1">Wakad, PCMC<br />Pune, Maharashtra</p>
                  </div>
                </div>
                
                {/* Direct Phone Dialer Link */}
                <div className="flex items-start">
                  <FaPhone className="text-red-500 text-xl mr-4 mt-1" />
                  <div>
                    <h3 className="font-bold uppercase text-sm">Phone</h3>
                    <a href="tel:+918625881282" className="text-gray-300 hover:text-white text-sm mt-1 block transition-colors underline">
                      +91 862-588-1282
                    </a>
                  </div>
                </div>

                {/* Direct WhatsApp Action */}
                <div className="flex items-start">
                  <FaWhatsapp className="text-green-500 text-xl mr-4 mt-1" />
                  <div>
                    <h3 className="font-bold uppercase text-sm">WhatsApp Chat</h3>
                    <button 
                      onClick={handleWhatsAppClick}
                      className="text-green-400 hover:text-green-300 text-sm mt-1 text-left font-semibold underline block cursor-pointer transition-colors"
                    >
                      Chat with us instantly
                    </button>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <FaEnvelope className="text-red-500 text-xl mr-4 mt-1" />
                  <div>
                    <h3 className="font-bold uppercase text-sm">Email</h3>
                    <a href="mailto:support@autoelite.com" className="text-gray-300 hover:text-white text-sm mt-1 block transition-colors underline">
                      support@autoelite.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form Panel */}
          <div className="p-10 md:w-2/3">
            <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-wide mb-6">Send a Message</h2>
            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Full Name</label>
                  <input type="text" required placeholder="John Doe" className="w-full border border-gray-300 p-3 rounded-sm focus:ring-red-500 focus:border-red-500 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Email Address</label>
                  <input type="email" required placeholder="john@example.com" className="w-full border border-gray-300 p-3 rounded-sm focus:ring-red-500 focus:border-red-500 text-sm" />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Subject</label>
                <input type="text" required placeholder="How can we help you?" className="w-full border border-gray-300 p-3 rounded-sm focus:ring-red-500 focus:border-red-500 text-sm" />
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Message</label>
                <textarea required rows="4" placeholder="Write your message here..." className="w-full border border-gray-300 p-3 rounded-sm focus:ring-red-500 focus:border-red-500 text-sm"></textarea>
              </div>
              
              <button type="submit" className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-sm uppercase tracking-widest transition-colors shadow-md cursor-pointer">
                Send Message
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}