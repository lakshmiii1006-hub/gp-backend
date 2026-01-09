import express from 'express';
import {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking
} from '../controllers/bookingController.js';

const router = express.Router();

// Public: Create booking
router.post('/', createBooking);

// Admin: Get all bookings
router.get('/', getBookings);

// Admin: Single booking operations
router.route('/:id')
  .get(getBookingById)
  .put(updateBooking)
  .delete(deleteBooking);

export default router;
