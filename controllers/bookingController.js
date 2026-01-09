import Booking from "../models/Booking.js";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// 1. CREATE booking - MAIN FUNCTION
export const createBooking = async (req, res) => {
  try {
    console.log('🔍 ENV CHECK:', {
      hasResendKey: !!process.env.RESEND_API_KEY,
      hasAdminEmail: !!process.env.ADMIN_EMAIL
    });
    
    const booking = await Booking.create(req.body);
    const bookingIdShort = booking._id.toString().slice(-6);
    
    console.log(`🌸 NEW BOOKING #${bookingIdShort}: ${booking.name}`);

    // CUSTOMER CONFIRMATION (TEXT - Higher deliverability)
    try {
      await resend.emails.send({
        from: 'gpflowerdecorators@gmail.com',
        to: [booking.email],
        subject: `✅ Booking Confirmed #${bookingIdShort}`,
        text: `Hi ${booking.name},

Your booking #${bookingIdShort} has been confirmed!

SERVICE: ${booking.service}
DATE: ${new Date(booking.eventDate).toLocaleDateString()}
PHONE: ${booking.phone}

We'll call you within 24 hours to finalize details.

Flower Decor Team 🌸`
      });
      console.log('✅ CUSTOMER EMAIL SENT');
    } catch (e) {
      console.error('❌ CUSTOMER EMAIL ERROR:', e.message);
    }

    // ADMIN NOTIFICATION (TEXT - Direct to you)
    try {
      await resend.emails.send({
        from: 'gpflowerdecorators@gmail.com',
        to: ['gpflowerdecorators@gmail.com'],
        subject: `🌸 NEW BOOKING #${bookingIdShort} - ${booking.name}`,
        text: `NEW BOOKING ALERT!

ID: #${bookingIdShort}
NAME: ${booking.name}
PHONE: ${booking.phone}
EMAIL: ${booking.email}
SERVICE: ${booking.service}
DATE: ${new Date(booking.eventDate).toLocaleDateString()}
MESSAGE: ${booking.message || 'None'}

Call customer ASAP! 📞`
      });
      console.log('✅ ADMIN EMAIL SENT');
    } catch (e) {
      console.error('❌ ADMIN EMAIL ERROR:', e.message);
    }

    res.status(201).json({ 
      message: 'Booking confirmed! 🌸', 
      bookingId: bookingIdShort 
    });

  } catch (error) {
    console.error('🚨 BOOKING ERROR:', error);
    res.status(500).json({ message: 'Booking failed' });
  }
};

// 2. GET ALL bookings (Admin dashboard)
export const getBookings = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const filter = status ? { status } : {};
    
    const bookings = await Booking.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Booking.countDocuments(filter);
    
    res.json({
      bookings,
      total,
      pages: Math.ceil(total / limit),
      current: page
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. GET single booking by ID
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. UPDATE booking (Admin panel)
export const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Update fields
    Object.assign(booking, req.body);
    await booking.save();
    
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 5. DELETE booking (Admin panel)
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    
    await booking.deleteOne();
    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
