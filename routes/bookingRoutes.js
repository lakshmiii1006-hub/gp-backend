import express from "express";
import {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/", createBooking);           // Create booking
router.get("/", getBookings);             // Get all bookings
router.get("/:id", getBookingById);       // Get single booking
router.put("/:id", updateBooking);        // Update booking
router.delete("/:id", deleteBooking);     // Delete booking

export default router;
