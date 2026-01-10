const express = require('express');
const router = express.Router();
const { createBooking, getBookings, approveBooking } = require('../controllers/bookingController');

router.post('/bookings', createBooking);           // ✅ Form submission
router.get('/bookings', getBookings);             // ✅ Admin loads table
router.put('/bookings/:id/approve', approveBooking); // ✅ Approve button

module.exports = router;
