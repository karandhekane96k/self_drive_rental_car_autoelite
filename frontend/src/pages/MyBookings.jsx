import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FaCalendarAlt, FaCheckCircle, FaCar, FaPhone, FaUser, FaClock, FaFileDownload } from 'react-icons/fa';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchUserBookings = async () => {
      if (!user) return;
      try {
        const userId = user._id || user.id;
        const response = await fetch(`https://self-drive-rental-car-autoelite.onrender.com/api/bookings/my-bookings?userId=${userId}`);
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

  // --- PDF Generation Function ---
  const generateInvoice = (booking) => {
    const doc = new jsPDF();

    // 1. Header Section
    doc.setFontSize(20); // Slightly smaller to fit the new name nicely
    doc.setTextColor(220, 38, 38);
    doc.text("NANDI SELF-DRIVE CARS", 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Premium Self-Drive Car Rentals", 14, 28);
    doc.text("Email: nandiselfcars@gmail.com", 14, 34);

    // 2. Invoice Title & Details
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("BOOKING INVOICE", 14, 50);
    
    doc.setFontSize(11);
    doc.text(`Booking ID: ${booking._id}`, 14, 60);
    doc.text(`Date Issued: ${new Date().toLocaleDateString()}`, 14, 66);
    doc.text(`Customer Name: ${booking.customerName}`, 14, 72);
    doc.text(`Phone: ${booking.customerPhone}`, 14, 78);

    // 3. SMARTER MATH LOGIC
    const isFullPayment = booking.depositType?.toLowerCase() === 'full';
    const amountPaid = isFullPayment ? booking.totalPrice : 500;
    const remainingBalance = isFullPayment ? 0 : booking.totalPrice - 500;
    const paymentLabel = isFullPayment ? `Rs. ${booking.totalPrice} (Paid in Full)` : `Rs. 500 (Token Deposit)`;

    // 4. Data Table
    autoTable(doc, {
      startY: 85,
      headStyles: { fillColor: [220, 38, 38] },
      head: [['Description', 'Details']],
      body: [
        ['Vehicle', `${booking.car?.brand || 'N/A'} ${booking.car?.name || ''}`],
        ['Transmission', booking.car?.transmission || 'N/A'],
        ['Start Date', new Date(booking.startDate).toLocaleDateString()],
        ['End Date', new Date(booking.endDate).toLocaleDateString()],
        ['Total Rental Price', `Rs. ${booking.totalPrice}`],
        ['Amount Paid', paymentLabel], 
        ['Balance Due at Pickup', `Rs. ${remainingBalance}`],
        ['Payment Status', booking.paymentStatus]
      ],
      theme: 'grid',
    });

    // 5. Footer
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Thank you for choosing Nandi Self-Drive Cars for your journey!", 14, doc.lastAutoTable.finalY + 20);
    doc.text("Please bring a valid driver's license at the time of pickup.", 14, doc.lastAutoTable.finalY + 26);

    // 6. Save and Download
    doc.save(`Nandi_Invoice_${booking.customerName.replace(/\s+/g, '_')}.pdf`);
  };

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
        {bookings.map((booking) => {
          
          // SMARTER MATH LOGIC FOR THE UI CARDS
          const isFullPayment = booking.depositType?.toLowerCase() === 'full';

          return (
            <div key={booking._id} className="bg-white rounded-sm shadow-lg overflow-hidden border border-gray-200 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              
              {/* Car Image & Info */}
              <div className="flex items-center space-x-4 w-full md:w-auto">
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

              {/* Customer Details */}
              <div className="text-sm text-gray-700 space-y-1 w-full md:w-auto">
                <p className="flex items-center"><FaUser className="mr-2 text-red-600 text-xs" /> <span className="font-semibold">{booking.customerName}</span></p>
                <p className="flex items-center"><FaPhone className="mr-2 text-gray-400 text-xs" /> <span>{booking.customerPhone}</span></p>
              </div>

              {/* Dates & Duration */}
              <div className="text-sm text-gray-700 space-y-1 w-full md:w-auto">
                <p className="flex items-center"><FaCalendarAlt className="mr-2 text-red-600 text-xs" /> From: <span className="font-semibold ml-1">{new Date(booking.startDate).toLocaleDateString()}</span></p>
                <p className="flex items-center"><FaCalendarAlt className="mr-2 text-gray-400 text-xs" /> To: <span className="font-semibold ml-1">{new Date(booking.endDate).toLocaleDateString()}</span></p>
              </div>

              {/* Total Price & Action Buttons */}
              <div className="text-right flex flex-col justify-between w-full md:w-56 items-start md:items-end border-t md:border-t-0 pt-4 md:pt-0 border-gray-100">
                
                <div className="flex flex-col items-start md:items-end mb-3 w-full">
                  <span className="text-sm text-gray-500">Total: ₹{booking.totalPrice}</span>
                  
                  {/* Updated UI Logic */}
                  {!isFullPayment ? (
                    <>
                      <span className="text-xs text-green-600 font-bold">Paid: ₹500 (Token)</span>
                      <span className="text-lg font-extrabold text-red-600 mt-1">Due: ₹{booking.totalPrice - 500}</span>
                    </>
                  ) : (
                    <>
                      <span className="text-xs text-green-600 font-bold">Paid in Full</span>
                      <span className="text-lg font-extrabold text-gray-400 mt-1">Due: ₹0</span>
                    </>
                  )}
                </div>
                
                <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-sm text-xs font-bold border ${
                    booking.paymentStatus === 'Pending Verification' 
                      ? 'bg-yellow-100 text-yellow-700 border-yellow-200' 
                      : 'bg-green-100 text-green-700 border-green-200'
                  }`}>
                    {booking.paymentStatus === 'Pending Verification' ? <FaClock className="mr-1" /> : <FaCheckCircle className="mr-1" />}
                    {booking.paymentStatus}
                  </span>

                  <button 
                    onClick={() => generateInvoice(booking)}
                    className="inline-flex items-center px-3 py-1.5 rounded-sm text-xs font-bold bg-gray-900 text-white hover:bg-gray-800 transition-colors shadow-sm cursor-pointer"
                    title="Download PDF Invoice"
                  >
                    <FaFileDownload className="mr-1.5" />
                    Invoice
                  </button>
                </div>
              </div>

            </div>
          );
        })}
        {bookings.length === 0 && (
          <div className="bg-white p-12 text-center rounded-sm shadow-md border border-gray-200">
            <p className="text-gray-500 text-lg italic mb-4">You have not made any vehicle reservations yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}