import Booking from "../models/Booking.js";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// CREATE booking + emails
export const createBooking = async (req, res) => {
  try {
    const booking = await Booking.create(req.body);
    const bookingIdShort = booking._id.toString().slice(-6);

    // CUSTOMER EMAIL
    await resend.emails.send({
      from: 'Flower Decor <no-reply@resend.dev>',
      to: [booking.email],
      subject: `✅ Booking Confirmed #${bookingIdShort}`,
      html: `<h1>🌸 Booking Confirmed!</h1><p>Hi ${booking.name}, we'll call you soon!</p>`
    });

    // ADMIN EMAIL  
    await resend.emails.send({
      from: 'Flower Decor <no-reply@resend.dev>',
      to: [process.env.ADMIN_EMAIL],
      subject: `🌸 New Booking #${bookingIdShort}`,
      html: `<h2>New Booking!</h2><p>${booking.name} - ${booking.phone}</p>`
    });

    res.status(201).json({ message: 'Booking confirmed!', bookingId: bookingIdShort });
  } catch (error) {
    console.error('Email error:', error);
    res.status(201).json({ message: 'Booking saved!' });
  }
};

// GET all bookings
export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET single booking
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE booking
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

// DELETE booking
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
