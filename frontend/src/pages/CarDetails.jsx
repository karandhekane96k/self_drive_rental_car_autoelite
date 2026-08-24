import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function CarDetails() {
  // useParams extracts the exact car ID from the web address URL!
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Fetch this specific car when the page loads
  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/cars/${id}`);
        const data = await response.json();
        setCar(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch car', error);
        setLoading(false);
      }
    };
    fetchCar();
  }, [id]);

  // A helper function to calculate the price based on selected dates
  const calculateTotal = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const timeDiff = end.getTime() - start.getTime();
      const days = Math.ceil(timeDiff / (1000 * 3600 * 24));
      
      return days > 0 ? days * car.dailyRate : 0;
    }
    return 0;
  };

  if (loading) return <div className="text-center mt-20 text-2xl font-bold">Loading vehicle details...</div>;
  if (!car) return <div className="text-center mt-20 text-2xl font-bold text-red-600">Car not found!</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="bg-white rounded-sm shadow-xl border border-gray-100 overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Car Image */}
        <div className="md:w-1/2">
          <img src={car.image} alt={car.name} className="w-full h-full object-cover min-h-[400px]" />
        </div>

        {/* Right Side: Details & Booking Form */}
        <div className="p-8 md:w-1/2 flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">{car.brand} {car.name}</h1>
            <p className="text-gray-500 mt-2 text-lg">Transmission: {car.transmission} | Seats: {car.seats}</p>
            <div className="mt-4 text-3xl font-bold text-red-600">
              ₹{car.dailyRate} <span className="text-lg text-gray-500 font-normal">/ day</span>
            </div>
          </div>

          <div className="mt-8 bg-gray-50 p-6 rounded-sm border border-gray-200 shadow-inner">
            <h3 className="text-xl font-bold mb-4">Reserve this vehicle</h3>
            <div className="flex flex-col space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pick-up Date</label>
                <input type="date" className="w-full border border-gray-300 p-2 rounded-sm focus:ring-red-500 focus:border-red-500" 
                  onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Return Date</label>
                <input type="date" className="w-full border border-gray-300 p-2 rounded-sm focus:ring-red-500 focus:border-red-500" 
                  onChange={(e) => setEndDate(e.target.value)} />
              </div>
              
              <div className="flex justify-between items-center text-xl font-bold py-4 border-t border-gray-300 mt-4">
                <span>Total Amount:</span>
                <span className="text-red-600">₹{calculateTotal()}</span>
              </div>

              <button 
                onClick={() => alert('Booking logic coming next!')}
                className="w-full bg-red-600 text-white font-bold py-3 rounded-sm hover:bg-red-700 transition-colors"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}