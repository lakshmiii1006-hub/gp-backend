import express from 'express';
const router = express.Router();
import Booking from '../models/Booking.js'; 
import emailjs from 'emailjs';

// Your existing POST route for creating bookings...
router.post('/', async (req, res) => {
  // your existing booking creation code
});

// 👇 ADD THIS NEW APPROVE ROUTE
router.put('/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    
    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { status: 'approved', approvedAt: new Date() },
      { new: true }
    );

    await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_ID,
      {
        to_email: updatedBooking.email,
        client_name: updatedBooking.name,
        phone: updatedBooking.phone,
        service_type: updatedBooking.service,
        event_date: updatedBooking.eventDate,
        booking_id: updatedBooking._id
      },
      process.env.EMAILJS_PUBLIC_KEY
    );

    res.json({ success: true, message: '✅ Email sent to customer!' });
  } catch (error) {
    res.status(500).json({ error: 'Email failed' });
  }
});

export default router;  // ← THIS FIXES THE ERROR
