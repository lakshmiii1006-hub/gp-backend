import Booking from "../models/Booking.js";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// 1. CREATE booking + send emails
export const createBooking = async (req, res) => {
  try {
    console.log('🔍 ENV CHECK:', {
      hasResendKey: !!process.env.RESEND_API_KEY,
      hasAdminEmail: !!process.env.ADMIN_EMAIL
    });
    
    const booking = await Booking.create(req.body);
    const bookingIdShort = booking._id.toString().slice(-6);
    
    console.log(`🌸 NEW BOOKING #${bookingIdShort}: ${booking.name}`);

    // CUSTOMER CONFIRMATION EMAIL
    try {
      await resend.emails.send({
        from: 'gpflowerdecorators@gmail.com',
        to: [booking.email],
        subject: `✅ Booking Confirmed #${bookingIdShort} - Flower Decor`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; text-align: center;">
            <h1 style="color: #e91e63;">🌸 Booking Confirmed!</h1>
            <p style="font-size: 18px;"><strong>Dear ${booking.name},</strong></p>
            <div style="background: #f8f9fa; padding: 30px; border-radius: 15px; margin: 20px 0;">
              <h2 style="color: #333;">Booking Details</h2>
              <p><strong>Booking ID:</strong> #${bookingIdShort}</p>
              <p><strong>Service:</strong> ${booking.service}</p>
              <p><strong>Date:</strong> ${new Date(booking.eventDate).toLocaleDateString()}</p>
              <p><strong>Phone:</strong> ${booking.phone}</p>
            </div>
            <p style="color: #666; font-size: 16px;">
              Our team will contact you within <strong>24 hours</strong> to confirm details.
            </p>
            <p style="color: #e91e63; font-size: 20px; font-weight: bold;">Thank you for choosing Flower Decor! ✨</p>
          </div>
        `
      });
      console.log('✅ CUSTOMER EMAIL SENT');
    } catch (emailError) {
      console.error('❌ CUSTOMER EMAIL ERROR:', emailError.message);
    }

    // ADMIN NOTIFICATION EMAIL
    if (process.env.ADMIN_EMAIL) {
      try {
        await resend.emails.send({
          from: 'gpflowerdecorators@gamil.com',
          to: [process.env.ADMIN_EMAIL],
          subject: `🌸 New Booking Received #${bookingIdShort}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #e91e63;">🔔 New Booking Alert!</h1>
              <div style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin: 20px 0;">
                <h2 style="color: #333;">Booking #${bookingIdShort}</h2>
                <p><strong>Name:</strong> ${booking.name}</p>
                <p><strong>Email:</strong> ${booking.email}</p>
                <p><strong>Phone:</strong> ${booking.phone}</p>
                <p><strong>Service:</strong> ${booking.service}</p>
                <p><strong>Event Date:</strong> ${new Date(booking.eventDate).toLocaleDateString()}</p>
                <p><strong>Message:</strong> ${booking.message || 'N/A'}</p>
              </div>
              <p style="color: #666;">
                <strong>Action Required:</strong> Call customer to confirm details within 24 hours.
              </p>
            </div>
          `
        });
        console.log('✅ ADMIN EMAIL SENT');
      } catch (emailError) {
        console.error('❌ ADMIN EMAIL ERROR:', emailError.message);
      }
    }

    res.status(201).json({ 
      message: 'Booking confirmed! 🌸', 
      bookingId: bookingIdShort 
    });

  } catch (error) {
    console.error('🚨 CREATE BOOKING ERROR:', error);
    res.status(500).json({ message: 'Booking failed. Please try again.' });
  }
};

// 2. GET all bookings (Admin panel)
export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
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

    // Update all fields
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
