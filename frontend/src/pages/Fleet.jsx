import { useState, useEffect, useContext } from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import BookingModal from '../components/BookingModal'; // Adjust path if your components folder is elsewhere

export default function Fleet() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State for Search and Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [transmission, setTransmission] = useState('All');

  // NEW: State for Booking Modal
  const [selectedCar, setSelectedCar] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch('https://self-drive-rental-car-autoelite.onrender.com/api/cars');
        const data = await response.json();
        setCars(data);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to fetch fleet.');
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  // Handle opening the modal
  const handleBookNowClick = (car) => {
    if (!user) {
      toast.error('Please log in to reserve a vehicle.');
      return;
    }
    setSelectedCar(car);
    setIsBookingOpen(true);
  };

  // Filter Logic: Filter cars based on search input AND transmission dropdown
  const filteredCars = cars.filter((car) => {
    const matchesSearch = 
      car.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      car.brand.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesTransmission = 
      transmission === 'All' || car.transmission === transmission;

    return matchesSearch && matchesTransmission;
  });

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-xl uppercase tracking-widest">Loading Fleet...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-16 relative">
      
      {/* Header Section */}
      <div className="bg-white py-12 border-b border-gray-200 text-center px-4">
        <h1 className="text-4xl font-extrabold uppercase tracking-tight text-gray-900 mb-2">
          Our Premium <span className="text-red-600">Fleet</span>
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Select your dream ride from our exclusive collection. Use the filters below to find the perfect match.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-8">
        
        {/* Search and Filter Bar */}
        <div className="bg-white p-4 rounded-sm shadow-md border border-gray-200 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Search Input */}
          <div className="relative w-full md:w-1/2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by brand or model (e.g., Maruti, Kia)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 text-sm"
            />
          </div>

          {/* Transmission Filter */}
          <div className="relative w-full md:w-1/4 flex items-center">
            <FaFilter className="text-gray-400 mr-3 hidden md:block" />
            <select
              value={transmission}
              onChange={(e) => setTransmission(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 text-sm font-bold text-gray-700 bg-white cursor-pointer"
            >
              <option value="All">All Transmissions</option>
              <option value="Manual">Manual</option>
              <option value="Automatic">Automatic</option>
            </select>
          </div>
          
        </div>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCars.map((car) => (
            <div key={car._id} className="bg-white rounded-sm shadow-lg overflow-hidden border border-gray-200 hover:shadow-2xl transition-shadow flex flex-col">
              <div className="relative h-56 bg-gray-200">
                <img 
                  src={car.image} 
                  alt={car.name} 
                  className={`w-full h-full object-cover ${!car.isAvailable ? 'opacity-70 grayscale' : ''}`}
                />
                {!car.isAvailable && (
                  <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-3 py-1 uppercase rounded-sm shadow-md">
                    Rented Out
                  </div>
                )}
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-xl font-extrabold text-gray-900 uppercase tracking-wide mb-1">
                  {car.brand} {car.name}
                </h2>
                <div className="flex justify-between text-xs text-gray-500 mb-6 font-semibold">
                  <span>Transmission: {car.transmission}</span>
                  <span>Seats: {car.seats}</span>
                </div>
                
                <div className="mt-auto">
                  <div className="text-center mb-4">
                    <span className="text-2xl font-extrabold text-red-600">₹{car.dailyRate}</span>
                    <span className="text-gray-500 text-sm font-medium"> / day</span>
                  </div>
                  
                  {car.isAvailable ? (
                    <button 
                      onClick={() => handleBookNowClick(car)}
                      className="w-full text-center bg-gray-900 hover:bg-black text-white font-bold py-3 px-4 rounded-sm uppercase tracking-widest transition-colors shadow-md cursor-pointer"
                    >
                      Book Now
                    </button>
                  ) : (
                    <button 
                      disabled
                      className="w-full text-center bg-gray-200 text-gray-500 font-bold py-3 px-4 rounded-sm uppercase tracking-widest cursor-not-allowed border border-gray-300"
                    >
                      Currently Unavailable
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCars.length === 0 && !loading && (
          <div className="text-center py-16 bg-white border border-gray-200 rounded-sm shadow-sm">
            <p className="text-gray-500 text-lg italic">No vehicles match your current filters.</p>
            <button 
              onClick={() => { setSearchTerm(''); setTransmission('All'); }}
              className="mt-4 text-red-600 font-bold hover:underline cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Render the Booking Modal */}
      {selectedCar && (
        <BookingModal 
          car={selectedCar} 
          isOpen={isBookingOpen} 
          onClose={() => setIsBookingOpen(false)} 
        />
      )}
    </div>
  );
}