import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export default function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/bookings');
      const data = await response.json();
      setBookings(data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch bookings.');
      setLoading(false);
    }
  };

  const handleVerifyPayment = async (id, currentStatus) => {
    // Toggle between Verified and Rejected
    const newStatus = currentStatus === 'Pending Verification' ? 'Verified' : 'Rejected';

    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${id}/payment`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus: newStatus })
      });

      if (response.ok) {
        toast.success(`Payment marked as ${newStatus}!`);
        fetchBookings(); // Refresh the list
      } else {
        toast.error('Failed to update payment status.');
      }
    } catch (error) {
      toast.error('Server error.');
    }
  };

  if (loading) return <div className="p-10 text-center font-bold">Loading Bookings...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold uppercase tracking-tight mb-8">Manage <span className="text-red-600">Bookings</span></h1>

      <div className="bg-white shadow-md rounded-sm border border-gray-200 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-900 text-white text-xs uppercase tracking-wider">
              <th className="p-4">Customer Details</th>
              <th className="p-4">Vehicle & Dates</th>
              <th className="p-4">Deposit Type</th>
              <th className="p-4 text-center">UTR Number</th>
              <th className="p-4 text-center">Payment Status</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm">
            {bookings.map((booking) => (
              <tr key={booking._id} className="hover:bg-gray-50">
                
                <td className="p-4">
                  <p className="font-bold text-gray-900 uppercase">{booking.customerName}</p>
                  <p className="text-gray-500 text-xs mt-1">Ph: {booking.customerPhone}</p>
                </td>
                
                <td className="p-4">
                  <p className="font-bold text-gray-800">{booking.car?.brand} {booking.car?.name}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(booking.startDate).toLocaleDateString()} to {new Date(booking.endDate).toLocaleDateString()}
                  </p>
                </td>

                <td className="p-4 uppercase text-xs font-bold text-gray-600">
                  {booking.depositType === 'bike' ? '2-Wheeler RC' : '₹5K Cash + Proof'}
                </td>
                
                {/* UTR Highlighted for Admin Checking */}
                <td className="p-4 text-center">
                  <span className="bg-gray-100 border border-gray-300 text-gray-900 font-extrabold px-3 py-1.5 rounded-sm tracking-widest block">
                    {booking.utrNumber}
                  </span>
                </td>

                <td className="p-4 text-center">
                  <span className={`px-3 py-1 rounded-sm text-[10px] font-bold uppercase inline-block ${
                    booking.paymentStatus === 'Verified' ? 'bg-green-100 text-green-700' : 
                    booking.paymentStatus === 'Rejected' ? 'bg-red-100 text-red-700' : 
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {booking.paymentStatus}
                  </span>
                </td>

                <td className="p-4 text-center">
                  {booking.paymentStatus === 'Pending Verification' ? (
                    <button 
                      onClick={() => handleVerifyPayment(booking._id, booking.paymentStatus)} 
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-sm text-xs font-bold uppercase transition-colors flex items-center justify-center w-full shadow-md cursor-pointer"
                    >
                      <FaCheckCircle className="mr-1.5" /> Verify ₹500
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleVerifyPayment(booking._id, booking.paymentStatus)} 
                      className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3 py-1.5 rounded-sm text-[10px] font-bold uppercase transition-colors w-full cursor-pointer"
                    >
                      <FaTimesCircle className="inline mr-1" /> Revoke
                    </button>
                  )}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
        
        {bookings.length === 0 && (
          <div className="text-center py-10 text-gray-500 font-bold uppercase">No bookings found in the system.</div>
        )}
      </div>
    </div>
  );
}