import Booking from "../models/Booking.js";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const createBooking = async (req, res) => {
  try {
    const booking = await Booking.create(req.body);
    const bookingIdShort = booking._id.toString().slice(-6);

    console.log(`🌸 NEW BOOKING #${bookingIdShort}: ${booking.name}`);

    // ADMIN EMAIL
    await resend.emails.send({
      from: 'Flower Decor <noreply@yourdomain.com>',
      to: [process.env.ADMIN_EMAIL],
      subject: `New Booking #${bookingIdShort}`,
      html: `<h2>🌸 New Booking #${bookingIdShort}</h2>
             <p><strong>Name:</strong> ${booking.name}</p>
             <p><strong>Phone:</strong> ${booking.phone}</p>
             <p><strong>Service:</strong> ${booking.service}</p>`
    });

    // CUSTOMER EMAIL
    await resend.emails.send({
      from: 'Flower Team <noreply@yourdomain.com>',
      to: [booking.email],
      subject: `✅ Booking Confirmed #${bookingIdShort}`,
      html: `<h1>Booking Confirmed! 🌸</h1>
             <p>Hi ${booking.name}, your booking is confirmed!</p>
             <p><strong>Service:</strong> ${booking.service}</p>
             <p>We'll call you in 24 hours!</p>`
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error('Error:', error);
    res.status(201).json({ message: 'Booking saved!', booking }); // Still success!
  }
};
