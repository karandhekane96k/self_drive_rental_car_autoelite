import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import BookingModal from './BookingModal';
import toast from 'react-hot-toast';

export default function CarCard({ car }) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const { user } = useContext(AuthContext);

  const handleBookNowClick = () => {
    if (!user) {
      toast.error('Please log in to reserve a vehicle.');
      return;
    }
    setIsBookingOpen(true);
  };

  return (
    <div className="bg-white rounded-sm shadow-xl overflow-hidden border border-gray-100 flex flex-col relative">
      
      {/* Rented Out Badge */}
      {!car.isAvailable && (
        <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-sm z-10 uppercase tracking-widest shadow-md">
          Rented Out
        </div>
      )}

      {/* Car Image */}
      <img 
        src={car.image} 
        alt={car.name} 
        className={`w-full h-48 sm:h-56 object-cover ${!car.isAvailable ? 'opacity-70 grayscale' : ''}`} 
      />
      
      <div className="p-5 sm:p-6 flex flex-col flex-grow">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{car.brand} {car.name}</h3>
        
        <div className="flex justify-between mt-3 text-xs sm:text-sm text-gray-500 font-medium border-b border-gray-100 pb-3">
          <p>Transmission: {car.transmission}</p>
          <p>Seats: {car.seats}</p>
        </div>
        
        <div className="mt-4 flex flex-col justify-between flex-grow">
          <span className="text-xl sm:text-2xl font-bold text-red-600 mb-4 text-center">
            ₹{car.dailyRate} <span className="text-xs sm:text-sm text-gray-500 font-normal">/ day</span>
          </span>
          
          {car.isAvailable ? (
            <button 
              onClick={handleBookNowClick}
              className="w-full bg-gray-900 text-white py-2.5 rounded-sm hover:bg-gray-800 transition-colors font-bold text-center text-sm mt-auto cursor-pointer uppercase tracking-wider"
            >
              Book Now
            </button>
          ) : (
            <button disabled className="w-full bg-gray-200 text-gray-500 py-2.5 rounded-sm cursor-not-allowed font-bold text-center text-sm mt-auto border border-gray-300 uppercase tracking-wider">
              Currently Unavailable
            </button>
          )}
        </div>
      </div>

      {/* Encapsulated Persistent Booking Modal Popup */}
      <BookingModal 
        car={car} 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
      />
    </div>
  );
}