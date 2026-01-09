import Booking from "../models/Booking.js";
import nodemailer from 'nodemailer';

// Email transporter setup
const transporter = nodemailer.createTransporter({
  service: 'gmail', // or 'hotmail', 'yahoo', etc.
  auth: {
    user: process.env.ADMIN_EMAIL,      // your admin email
    pass: process.env.ADMIN_EMAIL_PASS  // your app password
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
          <p><strong>Message:</strong> ${booking.message || 'N/A'}</p>
          <p><strong>Status:</strong> <span style="color: #ff9800;">${booking.status.toUpperCase()}</span></p>
        </div>
        <p style="color: #666;">Login to admin panel to manage this booking.</p>
      </div>
    `;

    // Email to USER - Confirmation
    const userEmailSubject = `✅ Booking Confirmed - #${booking._id.slice(-6)}`;
    const userEmailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; text-align: center;">
        <h1 style="color: #e91e63;">Booking Confirmed! 🌸✨</h1>
        <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e8f5e8 100%); padding: 30px; border-radius: 20px; margin: 20px 0;">
          <h2 style="color: #4caf50;">#${booking._id.slice(-6)}</h2>
          <p style="font-size: 18px; color: #333;"><strong>Dear ${booking.name},</strong></p>
          <p>Your booking has been received successfully!</p>
          <div style="background: white; padding: 20px; border-radius: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); margin: 20px 0;">
            <p><strong>Service:</strong> ${booking.service}</p>
            <p><strong>Event Date:</strong> ${new Date(booking.eventDate).toLocaleDateString()}</p>
            <p><strong>Status:</strong> <span style="color: #ff9800;">Pending Confirmation</span></p>
          </div>
          <p style="color: #666; font-size: 16px;">
            Our team will contact you within <strong>24 hours</strong> to confirm details and next steps.
          </p>
          <p style="color: #e91e63; font-size: 14px;">Thank you for choosing our flower decoration services! 🌸</p>
        </div>
      </div>
    `;

    // Send emails in parallel
    await Promise.all([
      // Admin email
      transporter.sendMail({
        from: `"Flower Decor Admin" <${process.env.ADMIN_EMAIL}>`,
        to: process.env.ADMIN_EMAIL,
        subject: adminEmailSubject,
        html: adminEmailBody
      }),
      // User email
      transporter.sendMail({
        from: `"Flower Decor Team" <${process.env.ADMIN_EMAIL}>`,
        to: booking.email,
        subject: userEmailSubject,
        html: userEmailBody
      })
    ]);

    console.log(`✅ Booking created & emails sent: #${booking._id.slice(-6)}`);
    res.status(201).json(booking);

  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ message: error.message });
  }
};

// GET ALL bookings (unchanged)
export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET single booking (unchanged)
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE booking (unchanged)
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

// DELETE booking (unchanged)
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
