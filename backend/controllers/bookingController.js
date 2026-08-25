import Booking from '../models/Booking.js';
import Car from '../models/Car.js';
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';

export const createBooking = async (req, res) => {
  try {
    const { 
      carId, userId, customerName, customerPhone, 
      startDate, endDate, totalPrice, depositType, utrNumber 
    } = req.body;

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
      depositType, 
      utrNumber,   
      paymentStatus: 'Pending Verification', 
      isRead: false 
    });

    car.isAvailable = false;
    await car.save();

    // --- DUAL EMAIL NOTIFICATION LOGIC ---
    try {
      const userRecord = await User.findById(finalUserId);
      
      if (userRecord && userRecord.email) {
        
        // 1. EMAIL TO THE CUSTOMER
        const customerMessage = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h2 style="color: #dc2626; text-align: center; text-transform: uppercase;">Nandi Self-Drive Cars</h2>
            <h3 style="color: #111827;">Booking Request Received! 🎉</h3>
            <p style="color: #4b5563;">Hi <strong>${customerName}</strong>,</p>
            <p style="color: #4b5563;">Your reservation request for the <strong>${car.brand} ${car.name}</strong> has been safely received.</p>
            
            <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; margin-top: 20px;">
              <p style="margin: 5px 0;"><strong>Start Date:</strong> ${new Date(startDate).toLocaleDateString()}</p>
              <p style="margin: 5px 0;"><strong>End Date:</strong> ${new Date(endDate).toLocaleDateString()}</p>
              <p style="margin: 5px 0; font-size: 18px;"><strong>Total Price:</strong> <span style="color: #dc2626; font-weight: bold;">₹${totalPrice}</span></p>
              <p style="margin: 10px 0 5px 0; font-size: 14px;"><strong>Payment Status:</strong> <span style="color: #d97706; font-weight: bold;">Pending Verification</span></p>
            </div>
            
            <p style="color: #4b5563; margin-top: 20px;">Our team is verifying your payment. We will prepare your vehicle for delivery shortly!</p>
            <p style="color: #9ca3af; font-size: 12px; margin-top: 20px; text-align: center;">Contact us at: nandiselfcars@gmail.com</p>
          </div>
        `;

        sendEmail({
          email: userRecord.email, // Sends to the person who booked
          subject: 'Nandi Cars - Booking Request Received',
          message: customerMessage
        }).catch(err => console.log("Customer email failed:", err));


        // 2. EMAIL TO THE ADMIN (YOU)
        const adminMessage = `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #dc2626;">🚨 New Booking Alert!</h2>
            <p>A new booking has just been placed on Nandi Cars.</p>
            <ul>
              <li><strong>Customer Name:</strong> ${customerName}</li>
              <li><strong>Phone:</strong> ${customerPhone}</li>
              <li><strong>Email:</strong> ${userRecord.email}</li>
              <li><strong>Vehicle:</strong> ${car.brand} ${car.name}</li>
              <li><strong>Dates:</strong> ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}</li>
              <li><strong>Total Price:</strong> ₹${totalPrice}</li>
              <li><strong>Deposit Type:</strong> ${depositType || 'Token'}</li>
              <li><strong>UTR Number:</strong> ${utrNumber}</li>
            </ul>
            <p>Please log in to the Admin Dashboard to verify this payment.</p>
          </div>
        `;

        sendEmail({
          email: 'nandiselfcars@gmail.com', // Sends an alert directly to your business email
          subject: `New Booking: ${car.brand} ${car.name}`,
          message: adminMessage
        }).catch(err => console.log("Admin email failed:", err));

      }
    } catch (emailError) {
      console.error('Failed to prepare confirmation emails:', emailError);
    }
    // --- END DUAL EMAIL LOGIC ---

    res.status(201).json({ message: 'Booking request sent successfully!', booking });
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('car', 'name brand image dailyRate')
      .populate('user', 'email')
      .sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};

export const markBookingsAsRead = async (req, res) => {
  try {
    await Booking.updateMany({ isRead: false }, { isRead: true });
    res.status(200).json({ message: 'Notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};

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

// --- UPDATED VERIFY PAYMENT (Sends the Final Receipt Email!) ---
export const verifyPayment = async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    
    // We use .populate() here so we can grab the user's email address and the car details
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { paymentStatus },
      { new: true }
    ).populate('user', 'email name').populate('car', 'brand name');
    
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // --- NEW: SEND OFFICIAL CONFIRMATION EMAIL TO CUSTOMER ---
    // If the admin changes the status to 'Confirmed' or 'Verified', send the email!
    if (paymentStatus === 'Confirmed' || paymentStatus === 'Verified') {
      try {
        const confirmedMessage = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <div style="text-align: center; background-color: #16a34a; padding: 10px; border-radius: 5px 5px 0 0;">
               <h2 style="color: white; margin: 0;">Payment Verified! ✅</h2>
            </div>
            <h2 style="color: #dc2626; text-align: center; margin-top: 20px; text-transform: uppercase;">Nandi Self-Drive Cars</h2>
            
            <p style="color: #4b5563;">Hi <strong>${booking.customerName}</strong>,</p>
            <p style="color: #4b5563;">Great news! We have successfully verified your ₹500 token payment. Your reservation for the <strong>${booking.car?.brand || 'Vehicle'} ${booking.car?.name || ''}</strong> is now <strong>100% CONFIRMED</strong>.</p>
            
            <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; margin-top: 20px; border-left: 4px solid #16a34a;">
              <p style="margin: 5px 0;"><strong>Booking ID:</strong> ${booking._id}</p>
              <p style="margin: 5px 0;"><strong>Start Date:</strong> ${new Date(booking.startDate).toLocaleDateString()}</p>
              <p style="margin: 5px 0;"><strong>End Date:</strong> ${new Date(booking.endDate).toLocaleDateString()}</p>
              <p style="margin: 5px 0; font-size: 16px;"><strong>Balance Due at Pickup:</strong> <span style="color: #dc2626; font-weight: bold;">₹${booking.totalPrice - 500}</span></p>
            </div>
            
            <p style="color: #4b5563; margin-top: 20px;">Please remember to bring your original Aadhar Card and Driving License at the time of pickup. We look forward to serving you!</p>
            <p style="color: #9ca3af; font-size: 12px; margin-top: 20px; text-align: center;">Contact us at: nandiselfcars@gmail.com | Phone: +91 8625881282</p>
          </div>
        `;

        sendEmail({
          email: booking.user.email,
          subject: 'Booking Confirmed! - Nandi Cars',
          message: confirmedMessage
        }).catch(err => console.log("Final confirmation email failed:", err));

      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
      }
    }
    // --- END EMAIL LOGIC ---

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};