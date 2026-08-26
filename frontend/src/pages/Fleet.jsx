import { useState, useEffect, useContext } from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import CarCard from '../components/CarCard'; 
import BookingModal from '../components/BookingModal'; // Added modal import

export default function Fleet() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State for Search and Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [transmission, setTransmission] = useState('All');

  // Global Modal State for Booking
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

  // Handle opening the global modal safely
  const handleOpenBooking = (car) => {
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
    <div className="flex flex-col min-h-screen bg-white relative">
      
      {/* Premium Hero Banner */}
      <div 
        className="relative w-full h-[50vh] min-h-[400px] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2070&auto=format&fit=crop')` }}
      >
        {/* Dark Overlay for transparent navbar visibility */}
        <div className="absolute inset-0 bg-black/70"></div>
        
        <div className="relative z-10 text-center px-4 mt-16">
          <h1 className="text-5xl md:text-6xl font-extrabold uppercase tracking-tight text-white mb-4 drop-shadow-lg">
            Our Premium <span className="text-red-600">Fleet</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-300 drop-shadow-md">
            Select your dream ride from our exclusive collection. Use the filters below to find the perfect match.
          </p>
        </div>
      </div>

      {/* Main Content Area with Grid Background */}
      <div className="relative w-full flex-grow pb-16">
        
        {/* THE GRID BACKGROUND */}
        <div 
          className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-50" 
          style={{ 
            backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.04) 1px, transparent 1px)', 
            backgroundSize: '40px 40px' 
          }}
        ></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-12">
          
          {/* Search and Filter Bar */}
          <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 mb-10 flex flex-col md:flex-row gap-4 items-center justify-between">
            
            {/* Search Input */}
            <div className="relative w-full md:w-1/2">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by brand or model (e.g., Maruti, Kia)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm transition-all"
              />
            </div>

            {/* Transmission Filter */}
            <div className="relative w-full md:w-1/4 flex items-center">
              <FaFilter className="text-gray-400 mr-3 hidden md:block" />
              <select
                value={transmission}
                onChange={(e) => setTransmission(e.target.value)}
                className="w-full p-3.5 bg-gray-50 border border-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm font-bold text-gray-700 cursor-pointer transition-all"
              >
                <option value="All">All Transmissions</option>
                <option value="Manual">Manual</option>
                <option value="Automatic">Automatic</option>
              </select>
            </div>
            
          </div>

          {/* Cars Grid - Passing the onBookClick callback down to CarCard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCars.map((car) => (
              <CarCard key={car._id} car={car} onBookClick={handleOpenBooking} />
            ))}
          </div>

          {/* Empty State */}
          {filteredCars.length === 0 && !loading && (
            <div className="text-center py-20 bg-white border border-gray-100 rounded-xl shadow-sm">
              <p className="text-gray-500 text-lg font-medium">No vehicles match your current filters.</p>
              <button 
                onClick={() => { setSearchTerm(''); setTransmission('All'); }}
                className="mt-4 bg-gray-900 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-red-600 transition-colors shadow-md cursor-pointer uppercase tracking-wider text-sm"
              >
                Clear Filters
              </button>
            </div>
          )}

        </div>
      </div>

      {/* GLOBAL BOOKING MODAL (Renders safely at root layer over the fleet page) */}
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