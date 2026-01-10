import express from "express";
const router = express.Router();

import {
  createBooking,
  getBookings,
  approveBooking,
  deleteBooking
} from "../controllers/bookingController.js";

// CREATE booking
router.post("/", createBooking);          // POST /api/booking

// GET all bookings
router.get("/", getBookings);             // GET /api/booking  ✅

// APPROVE booking
router.put("/:id/approve", approveBooking); // PUT /api/booking/:id/approve

router.delete("/:id", deleteBooking);  // ← CORRECT PATH

export default router;
