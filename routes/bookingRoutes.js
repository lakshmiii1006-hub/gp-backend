import express from "express";
const router = express.Router();

import { createBooking, getBookings, approveBooking } from "../controllers/bookingController.js";

// ✅ ALL ROUTES USE "bookings" (plural) - CONSISTENT!
router.post('/bookings', createBooking);           // POST /api/booking/bookings
router.get('/bookings', getBookings);              // GET /api/booking/bookings  ✅ FIXED
router.put('/bookings/:id/approve', approveBooking); // PUT /api/booking/bookings/:id/approve

export default router;
