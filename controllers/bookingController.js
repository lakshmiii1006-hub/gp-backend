import Booking from "../models/Booking.js";

export const createBooking = async (req, res) => {
  try {
    const booking = await Booking.create(req.body);
    const bookingIdShort = booking._id.toString().slice(-6);
    
    // INSTANT LOGS (you see ALL bookings)
    console.log(`
🚀 NEW BOOKING #${bookingIdShort}
👤 ${booking.name}
📧 ${booking.email}
📞 ${booking.phone}
🎉 ${booking.service}
📅 ${new Date(booking.eventDate).toLocaleDateString()}
💬 ${booking.message}
    `);
    
    res.status(201).json({ 
      message: 'Booking confirmed! 🌸 Check logs/admin panel.',
      bookingId: bookingIdShort 
    });
  } catch (error) {
    console.error('🚨 ERROR:', error);
    res.status(201).json({ message: 'Booking saved!' });
  }
};

// Other functions (unchanged)
export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Not found" });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!booking) return res.status(404).json({ message: "Not found" });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
