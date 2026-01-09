const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking'); // adjust path
const emailjs = require('emailjs');

// 👇 ADD YOUR APPROVE ROUTE HERE
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

// Export router
module.exports = router;
