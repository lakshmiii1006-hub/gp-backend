import express from "express";
import {
  createBooking,
  updateBooking,
  markRead,
  getBookings,
} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/", createBooking);
router.get("/", getBookings);
router.patch("/:id", updateBooking); // approve/reject
router.patch("/read/:id", markRead); // mark as read

export default router;
