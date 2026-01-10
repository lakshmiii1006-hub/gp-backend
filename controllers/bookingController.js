// controllers/bookingController.js
import Booking from "../models/Booking.js";

export const createBooking = async (req, res) => {
  try {
    const booking = new Booking(req.body);
    const saved = await booking.save();
    res.status(201).json({ 
      success: true, 
      bookingId: saved._id 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 }).lean();
    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const approveBooking = async (req, res) => {  // ✅ MISSING THIS!
  try {
    await Booking.findByIdAndUpdate(req.params.id, { 
      status: 'approved' 
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Approval failed' });
  }
};
export const deleteBooking = async (req, res) => {
  await Booking.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};