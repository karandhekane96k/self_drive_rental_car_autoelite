import Booking from '../models/Booking.js';
import Car from '../models/Car.js';
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';

// @desc    Create a new booking reservation
// @route   POST /api/bookings
// @access  Private (Logged-in user)
export const createBooking = async (req, res) => {
  try {
    const { 
      carId, userId, customerName, customerPhone, 
      startDate, endDate, totalPrice, depositType, utrNumber 
    } = req.body;

    // Safely retrieve user ID from middleware or request body fallback
    const finalUserId = req.user?._id || req.user?.id || userId;

    if (!finalUserId) {
      return res.status(401).json({ message: 'Authentication error. Please log in again.' });
    }

    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    const booking = await Booking.create({
      car: carId,
      user: finalUserId,
      customerName,
      customerPhone,
      startDate,
      endDate,
      totalPrice,
      depositType, // Saved from frontend
      utrNumber,   // Saved from frontend
      paymentStatus: 'Pending Verification', 
      isRead: false // Unread by default to trigger the admin notification badge
    });

    // Automatically mark the car as Taken/Unavailable when booked
    car.isAvailable = false;
    await car.save();

    // --- EMAIL NOTIFICATION LOGIC ---
    try {
      // Find the user's email from the database
      const userRecord = await User.findById(finalUserId);
      
      if (userRecord && userRecord.email) {
        const emailMessage = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h2 style="color: #dc2626; text-align: center; text-transform: uppercase;">AutoElite</h2>
            <h3 style="color: #111827;">Booking Request Received! 🎉</h3>
            <p style="color: #4b5563;">Hi <strong>${customerName}</strong>,</p>
            <p style="color: #4b5563;">Your reservation request for the <strong>${car.brand} ${car.name}</strong> has been safely received.</p>
            
            <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; margin-top: 20px;">
              <p style="margin: 5px 0;"><strong>Start Date:</strong> ${new Date(startDate).toLocaleDateString()}</p>
              <p style="margin: 5px 0;"><strong>End Date:</strong> ${new Date(endDate).toLocaleDateString()}</p>
              <p style="margin: 5px 0; font-size: 18px;"><strong>Total Price:</strong> <span style="color: #dc2626; font-weight: bold;">₹${totalPrice}</span></p>
              <p style="margin: 10px 0 5px 0; font-size: 14px;"><strong>Payment Status:</strong> <span style="color: #d97706; font-weight: bold;">Pending Verification</span></p>
              <p style="margin: 5px 0; font-size: 14px;"><strong>UTR Submitted:</strong> ${utrNumber}</p>
            </div>
            
            <p style="color: #4b5563; margin-top: 20px;">Our team is verifying your ₹500 token payment. We will prepare your vehicle for delivery shortly!</p>
          </div>
        `;

        await sendEmail({
          email: userRecord.email,
          subject: 'AutoElite - Booking Request Received',
          message: emailMessage
        });
      }
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // We don't return an error here because the booking itself was successful in the database
    }
    // --- END EMAIL NOTIFICATION LOGIC ---

    res.status(201).json({ message: 'Booking request sent successfully!', booking });
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};

// @desc    Get all bookings for Admin panel
// @route   GET /api/bookings
// @access  Admin
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('car', 'name brand image dailyRate')
      .populate('user', 'email')
      .sort({ createdAt: -1 }); // Newest bookings first
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};

// @desc    Mark all bookings as read
// @route   PATCH /api/bookings/read
// @access  Admin
export const markBookingsAsRead = async (req, res) => {
  try {
    await Booking.updateMany({ isRead: false }, { isRead: true });
    res.status(200).json({ message: 'Notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};

// @desc    Get bookings for logged-in user
// @route   GET /api/bookings/my-bookings
// @access  Private
export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id || req.query.userId;
    const bookings = await Booking.find({ user: userId })
      .populate('car', 'name brand image dailyRate transmission seats')
      .sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};

// @desc    Update Booking Payment Status (Admin)
// @route   PATCH /api/bookings/:id/payment
// @access  Admin
export const verifyPayment = async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { paymentStatus },
      { new: true }
    );
    
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};