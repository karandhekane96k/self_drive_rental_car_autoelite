import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FaCogs, FaUserFriends } from 'react-icons/fa';

export default function CarCard({ car, onBookClick }) {
  const { user } = useContext(AuthContext);

  const handleBookNowClick = () => {
    if (!user) {
      toast.error('Please log in to reserve a vehicle.');
      return;
    }
    // Trigger the parent page to open the global modal
    if (onBookClick) {
      onBookClick(car);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col relative group">
      
      {/* Sleeker, smaller Rented Out Badge */}
      {!car.isAvailable && (
        <div className="absolute top-3 right-3 bg-red-600/95 backdrop-blur-sm text-white text-[10px] font-extrabold px-3 py-1 rounded-sm z-10 uppercase tracking-widest shadow-sm">
          Rented Out
        </div>
      )}

      {/* Image */}
      <div className="relative w-full h-48 bg-gray-50 overflow-hidden">
        <img 
          src={car.image} 
          alt={car.name} 
          className={`w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105 ${!car.isAvailable ? 'opacity-70 grayscale' : ''}`} 
        />
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        
        {/* ROW 1: Name and Price */}
        <div className="flex justify-between items-start mb-4 gap-2">
          <div className="overflow-hidden">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{car.brand}</p>
            <h3 className="text-lg font-black text-gray-900 truncate">{car.name}</h3>
          </div>
          <div className="text-right flex-shrink-0">
            <span className="text-lg font-black text-red-600">₹{car.dailyRate}</span>
            <span className="text-[10px] font-semibold text-gray-400 block uppercase tracking-wider">Per Day</span>
          </div>
        </div>
        
        {/* ROW 2: Specs Bar */}
        <div className="flex items-center gap-4 text-xs font-semibold text-gray-500 mb-5 bg-gray-50 px-3 py-2.5 rounded-md border border-gray-100">
          <div className="flex items-center gap-1.5">
            <FaCogs className="text-gray-400 text-sm" />
            <span>{car.transmission}</span>
          </div>
          <div className="w-px h-4 bg-gray-300"></div>
          <div className="flex items-center gap-1.5">
            <FaUserFriends className="text-gray-400 text-sm" />
            <span>{car.seats} Seats</span>
          </div>
        </div>
        
        {/* ROW 3: Button */}
        <div className="mt-auto">
          {car.isAvailable ? (
            <button 
              onClick={handleBookNowClick}
              className="w-full bg-gray-900 text-white py-2.5 rounded-md hover:bg-red-600 transition-colors duration-300 font-extrabold text-center text-xs cursor-pointer uppercase tracking-widest shadow-sm hover:shadow-md"
            >
              Book Now
            </button>
          ) : (
            <button disabled className="w-full bg-gray-100 text-gray-400 py-2.5 rounded-md cursor-not-allowed font-extrabold text-center text-xs border border-gray-200 uppercase tracking-widest">
              Unavailable
            </button>
          )}
        </div>
      </div>
    </div>
  );
}