import express from 'express';
import Booking from '../models/Booking.js'; 
const router = express.Router();

// 👇 APPROVE ROUTE WITH DYNAMIC EMAILJS IMPORT
router.put('/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Update booking status
    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { status: 'approved', approvedAt: new Date() },
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Dynamic import emailjs (fixes ES6 issue)
    const emailjs = await import('@emailjs/nodejs');
    
    await emailjs.send({
      service_id: process.env.EMAILJS_SERVICE_ID,
      template_id: process.env.EMAILJS_TEMPLATE_ID,
      user_id: process.env.EMAILJS_PUBLIC_KEY,
      template_params: {
        to_email: updatedBooking.email,
        client_name: updatedBooking.name,
        phone: updatedBooking.phone,
        service_type: updatedBooking.service,
        event_date: updatedBooking.eventDate,
        booking_id: updatedBooking._id
      }
    });

    res.json({ success: true, message: '✅ Email sent to customer!' });
    
  } catch (error) {
    console.error('Approval error:', error);
    res.status(500).json({ error: 'Email failed' });
  }
});

export default router;
