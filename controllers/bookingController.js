const Booking = require('../models/Booking');

exports.createBooking = async (req, res) => {
  try {
    const booking = new Booking(req.body);
    const saved = await booking.save();
    res.status(201).json({ 
      success: true, 
      bookingId: saved._id,
      message: 'Booking created!' 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 }).lean();
    res.json({ bookings });  // Matches your frontend: res.data.bookings
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.approveBooking = async (req, res) => {
  try {
    await Booking.findByIdAndUpdate(req.params.id, { 
      status: 'approved' 
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Approval failed' });
  }
};
