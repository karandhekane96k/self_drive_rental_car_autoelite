import express from 'express';
import { 
  createBooking, 
  getAllBookings, 
  markBookingsAsRead, 
  getUserBookings,
  verifyPayment // <-- NEW IMPORT
} from '../controllers/bookingController.js';

const router = express.Router();

// Create a new booking
router.post('/', createBooking);

// Get all bookings (Admin)
router.get('/', getAllBookings);

// Mark all bookings as read (Admin Notification Clear)
router.patch('/read', markBookingsAsRead); 

// Get bookings for the logged-in user
router.get('/my-bookings', getUserBookings);

// Update payment status (Admin verify UTR)
router.patch('/:id/payment', verifyPayment); // <-- NEW ROUTE

export default router;