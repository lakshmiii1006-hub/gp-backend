import Booking from "../models/Booking.js";
import nodemailer from 'nodemailer';

// ✅ FIXED: createTransport (not createTransporter)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_EMAIL_PASS
  }
});

// CREATE booking with email notifications
export const createBooking = async (req, res) => {
  try {
    const booking = await Booking.create(req.body);

    // Email to ADMIN - New booking arrived
    const adminEmailSubject = `🌸 New Booking Received - #${booking._id.slice(-6)}`;
    const adminEmailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #e91e63;">New Booking Alert! 🌸</h2>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <p><strong>Booking ID:</strong> #${booking._id.slice(-6)}</p>
          <p><strong>Name:</strong> ${booking.name}</p>
          <p><strong>Email:</strong> ${booking.email}</p>
          <p><strong>Phone:</strong> ${booking.phone}</p>
          <p><strong>Service:</strong> ${booking.service}</p>
          <p><strong>Event Date:</strong> ${new Date(booking.eventDate).toLocaleDateString()}</p>
          <p><strong>Status:</strong> <span style="color: #ff9800;">${booking.status.toUpperCase()}</span></p>
        </div>
      </div>
    `;

    // Email to USER - Confirmation
    const userEmailSubject = `✅ Booking Confirmed - #${booking._id.slice(-6)}`;
    const userEmailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; text-align: center;">
        <h1 style="color: #e91e63;">Booking Confirmed! 🌸✨</h1>
        <p style="font-size: 18px; color: #333;"><strong>Dear ${booking.name},</strong></p>
        <p>Your booking has been received successfully!</p>
        <div style="background: white; padding: 20px; border-radius: 15px; margin: 20px 0;">
          <p><strong>Service:</strong> ${booking.service}</p>
          <p><strong>Event Date:</strong> ${new Date(booking.eventDate).toLocaleDateString()}</p>
        </div>
        <p style="color: #666; font-size: 16px;">
          Our team will contact you within <strong>24 hours</strong> to confirm details.
        </p>
      </div>
    `;

    // Send emails
    await Promise.all([
      transporter.sendMail({
        from: `"Flower Decor" <${process.env.ADMIN_EMAIL}>`,
        to: process.env.ADMIN_EMAIL,
        subject: adminEmailSubject,
        html: adminEmailBody
      }),
      transporter.sendMail({
        from: `"Flower Decor Team" <${process.env.ADMIN_EMAIL}>`,
        to: booking.email,
        subject: userEmailSubject,
        html: userEmailBody
      })
    ]);

    res.status(201).json(booking);
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Rest of your functions remain the SAME...
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
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.name = req.body.name || booking.name;
    booking.email = req.body.email || booking.email;
    booking.phone = req.body.phone || booking.phone;
    booking.service = req.body.service || booking.service;
    booking.eventDate = req.body.eventDate || booking.eventDate;
    booking.message = req.body.message || booking.message;
    booking.status = req.body.status || booking.status;

    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    await booking.deleteOne();
    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
