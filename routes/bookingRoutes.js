import express from "express";
const router = express.Router();

import { createBooking, getBookings, approveBooking } from "../controllers/bookingController.js";

router.post('/booking', createBooking);
router.get('/booking', getBookings);
router.put('/booking/:id/approve', approveBooking);

export default router;  // ✅ FIXED
