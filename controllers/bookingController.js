import Booking from "../models/Booking.js";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// 1. CREATE booking
export const createBooking = async (req, res) => {
  try {
    console.log('🔍 ENV CHECK:', {
      hasResendKey: !!process.env.RESEND_API_KEY,
      hasAdminEmail: !!process.env.ADMIN_EMAIL
    });
    
    const booking = await Booking.create(req.body);
    const bookingIdShort = booking._id.toString().slice(-6);
    
    console.log(`🌸 NEW BOOKING #${bookingIdShort}: ${booking.name}`);

    // Customer email
    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: 'Flower Decor <no-reply@resend.dev>',
          to: [booking.email],
          subject: `✅ Booking Confirmed #${bookingIdShort}`,
          html: `<h1>🌸 Booking Confirmed!</h1><p>Hi ${booking.name}, we'll call you within 24 hours!</p>`
        });
        console.log('✅ CUSTOMER EMAIL SENT');
      } catch (e) {
        console.error('❌ CUSTOMER EMAIL ERROR:', e.message);
      }
    }

    // Admin email
    if (process.env.ADMIN_EMAIL) {
      try {
        await resend.emails.send({
          from: 'Flower Decor <no-reply@resend.dev>',
          to: [process.env.ADMIN_EMAIL],
          subject: `🌸 New Booking #${bookingIdShort}`,
          html: `<h2>New Booking!</h2><p>${booking.name}<br>${booking.phone}<br>${booking.service}</p>`
        });
        console.log('✅ ADMIN EMAIL SENT');
      } catch (e) {
        console.error('❌ ADMIN EMAIL ERROR:', e.message);
      }
    }

    res.status(201).json({ 
      message: 'Booking confirmed!', 
      bookingId: bookingIdShort 
    });
  } catch (error) {
    console.error('🚨 CREATE ERROR:', error);
    res.status(500).json({ message: 'Booking failed' });
  }
};

// 2. GET all bookings  
export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. GET single booking
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. UPDATE booking
export const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    Object.assign(booking, req.body);
    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 5. DELETE booking (THIS WAS MISSING!)
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
