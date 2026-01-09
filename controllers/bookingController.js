import Booking from "../models/Booking.js";
import nodemailer from 'nodemailer';

// ✅ SENDGRID (works everywhere)
const transporter = nodemailer.createTransporter({
  host: "smtp.sendgrid.net",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "apikey",
    pass: process.env.SENDGRID_API_KEY  // Only 1 env var needed!
  }
});

// CREATE booking with emails to BOTH user + admin
export const createBooking = async (req, res) => {
  try {
    const booking = await Booking.create(req.body);
    const bookingIdShort = booking._id.toString().slice(-6);

    // ADMIN EMAIL - New booking notification
    const adminSubject = `🌸 New Booking #${bookingIdShort}`;
    const adminHtml = `
      <h2>🔔 New Booking Received!</h2>
      <p><strong>ID:</strong> #${bookingIdShort}</p>
      <p><strong>Name:</strong> ${booking.name}</p>
      <p><strong>Email:</strong> ${booking.email}</p>
      <p><strong>Phone:</strong> ${booking.phone}</p>
      <p><strong>Service:</strong> ${booking.service}</p>
      <p><strong>Date:</strong> ${new Date(booking.eventDate).toLocaleDateString()}</p>
    `;

    // USER EMAIL - Confirmation  
    const userSubject = `✅ Booking Confirmed #${bookingIdShort}`;
    const userHtml = `
      <h1>Booking Confirmed! 🌸</h1>
      <p>Hi <strong>${booking.name}</strong>,</p>
      <p>Your booking has been received! We'll call you within <strong>24 hours</strong>.</p>
      <p>Service: ${booking.service}<br>
      Date: ${new Date(booking.eventDate).toLocaleDateString()}</p>
    `;

    // Send BOTH emails
    await Promise.all([
      transporter.sendMail({
        from: '"Flower Decor" <noreply@yourdomain.com>',
        to: process.env.ADMIN_EMAIL,  // your personal email
        subject: adminSubject,
        html: adminHtml
      }),
      transporter.sendMail({
        from: '"Flower Team" <noreply@yourdomain.com>', 
        to: booking.email,
        subject: userSubject,
        html: userHtml
      })
    ]);

    console.log(`✅ Emails sent for booking #${bookingIdShort}`);
    res.status(201).json(booking);

  } catch (error) {
    console.error('Booking error:', error.message);
    res.status(500).json({ message: 'Booking saved but email failed' });
  }
};

// Keep other functions same...
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
