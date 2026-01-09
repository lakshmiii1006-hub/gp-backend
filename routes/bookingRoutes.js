import express from 'express';
import Booking from '../models/Booking.js'; 
const router = express.Router();

// 1. GET ALL BOOKINGS (Admin dashboard)
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// 2. CREATE NEW BOOKING (Customer form)
router.post('/', async (req, res) => {
  try {
    const booking = new Booking({
      ...req.body,
      status: 'pending', // Default status
      createdAt: new Date()
    });
    await booking.save();
    res.json({ 
      success: true, 
      bookingId: booking._id,
      message: 'Booking saved! Awaiting admin approval.'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save booking' });
  }
});

// 3. APPROVE BOOKING + SEND EMAIL (Admin action)
router.put('/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Update booking status
    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { 
        status: 'approved', 
        approvedAt: new Date() 
      },
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Send EmailJS confirmation to customer
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

    res.json({ 
      success: true, 
      message: '✅ Booking approved & email sent to customer!' 
    });
    
  } catch (error) {
    console.error('Approval error:', error);
    res.status(500).json({ error: 'Email failed' });
  }
});

export default router;
