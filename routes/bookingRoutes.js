import express from "express";
const router = express.Router();

import { createBooking, getBookings, approveBooking } from "../controllers/bookingController.js";

router.post('/bookings', createBooking);        // → POST /api/booking/bookings
router.get('/booking', getBookings);           // → GET /api/booking/bookings  
router.put('/booking/:id/approve', approveBooking);  // → PUT /api/booking/bookings/:id/approve

export default router;
