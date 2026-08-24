import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    depositType: { type: String, required: true }, // Tracks Bike vs Cash deposit
    utrNumber: { type: String, required: true },   // Tracks the 12-digit UTR
    paymentStatus: { 
      type: String, 
      enum: ['Pending Verification', 'Verified', 'Rejected'], 
      default: 'Pending Verification' 
    },
    status: { type: String, default: 'Confirmed' },
    isRead: { type: Boolean, default: false } // Tracks unread notifications for Admin
  },
  { timestamps: true }
);

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;