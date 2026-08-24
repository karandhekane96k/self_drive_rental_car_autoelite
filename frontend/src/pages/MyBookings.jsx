import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FaCalendarAlt, FaCheckCircle, FaCar, FaPhone, FaUser } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchUserBookings = async () => {
      if (!user) return;
      try {
        const userId = user._id || user.id;
        const response = await fetch(`http://localhost:5000/api/bookings/my-bookings?userId=${userId}`);
        const data = await response.json();
        setBookings(data);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to load your reservations.');
        setLoading(false);
      }
    };
    fetchUserBookings();
  }, [user]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-xl">Loading your bookings...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-tight">
          My <span className="text-red-600">Reservations</span>
        </h1>
        <p className="text-gray-500 mt-2">View the history and status of all your vehicle bookings.</p>
      </div>

      <div className="space-y-6">
        {bookings.map((booking) => (
          <div key={booking._id} className="bg-white rounded-sm shadow-lg overflow-hidden border border-gray-200 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            
            {/* Car Image & Info */}
            <div className="flex items-center space-x-4">
              {booking.car ? (
                <>
                  <img src={booking.car.image} alt={booking.car.name} className="w-28 h-20 object-cover rounded-sm border border-gray-300 shadow-sm" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{booking.car.brand} {booking.car.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">Daily Rate: ₹{booking.car.dailyRate} / day</p>
                    <p className="text-xs text-gray-500">Transmission: {booking.car.transmission} | Seats: {booking.car.seats}</p>
                  </div>
                </>
              ) : (
                <span className="text-gray-400 italic">Vehicle information unavailable</span>
              )}
            </div>

            {/* Customer Details Registered */}
            <div className="text-sm text-gray-700 space-y-1">
              <p className="flex items-center"><FaUser className="mr-2 text-red-600 text-xs" /> <span className="font-semibold">{booking.customerName}</span></p>
              <p className="flex items-center"><FaPhone className="mr-2 text-gray-400 text-xs" /> <span>{booking.customerPhone}</span></p>
            </div>

            {/* Dates & Duration */}
            <div className="text-sm text-gray-700 space-y-1">
              <p className="flex items-center"><FaCalendarAlt className="mr-2 text-red-600 text-xs" /> From: <span className="font-semibold ml-1">{new Date(booking.startDate).toLocaleDateString()}</span></p>
              <p className="flex items-center"><FaCalendarAlt className="mr-2 text-gray-400 text-xs" /> To: <span className="font-semibold ml-1">{new Date(booking.endDate).toLocaleDateString()}</span></p>
            </div>

            {/* Total Price & Status */}
            <div className="text-right flex md:flex-col justify-between w-full md:w-auto items-center md:items-end border-t md:border-t-0 pt-4 md:pt-0 border-gray-100">
              <span className="text-2xl font-extrabold text-red-600">₹{booking.totalPrice}</span>
              <span className="inline-flex items-center px-3 py-1 mt-2 rounded-sm text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                <FaCheckCircle className="mr-1" /> {booking.status}
              </span>
            </div>

          </div>
        ))}

        {bookings.length === 0 && (
          <div className="bg-white p-12 text-center rounded-sm shadow-md border border-gray-200">
            <p className="text-gray-500 text-lg italic mb-4">You have not made any vehicle reservations yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}