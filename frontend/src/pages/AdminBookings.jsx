import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FaCalendarAlt, FaPhone, FaUser, FaCheckCircle, FaCar } from 'react-icons/fa';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
    markNotificationsAsRead();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch('https://self-drive-rental-car-autoelite.onrender.com/api/bookings');
      const data = await response.json();
      setBookings(data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load reservations.');
      setLoading(false);
    }
  };

  const markNotificationsAsRead = async () => {
    try {
      await fetch('https://self-drive-rental-car-autoelite.onrender.com/api/bookings/read', { method: 'PATCH' });
    } catch (error) {
      console.error('Failed to clear notification badges', error);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-xl">Loading Reservations...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-tight">
          Customer <span className="text-red-600">Reservations</span>
        </h1>
      </div>

      <div className="bg-white shadow-xl rounded-sm overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-900 text-white text-sm uppercase tracking-wider">
                <th className="p-4">Vehicle</th>
                <th className="p-4">Customer Details</th>
                <th className="p-4">Rental Period</th>
                <th className="p-4 text-center">Total Price</th>
                <th className="p-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-50">
                  <td className="p-4 flex items-center space-x-4">
                    {booking.car ? (
                      <>
                        <img src={booking.car.image} alt={booking.car.name} className="w-16 h-12 object-cover rounded-sm border border-gray-300" />
                        <div>
                          <p className="font-bold text-gray-900">{booking.car.brand} {booking.car.name}</p>
                        </div>
                      </>
                    ) : (
                      <span className="text-gray-400 italic">Vehicle removed</span>
                    )}
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-gray-900 flex items-center"><FaUser className="mr-1.5 text-red-600 text-xs" /> {booking.customerName}</p>
                    <p className="text-xs text-gray-500 flex items-center mt-1"><FaPhone className="mr-1.5 text-gray-400 text-xs" /> {booking.customerPhone}</p>
                  </td>
                  <td className="p-4 text-sm text-gray-700">
                    <p className="flex items-center"><FaCalendarAlt className="mr-1.5 text-red-600 text-xs" /> {new Date(booking.startDate).toLocaleDateString()}</p>
                  </td>
                  <td className="p-4 text-center font-extrabold text-red-600 text-lg">₹{booking.totalPrice}</td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-sm text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                      <FaCheckCircle className="mr-1" /> {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr><td colSpan="5" className="p-8 text-center text-gray-500 italic">No reservations found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}