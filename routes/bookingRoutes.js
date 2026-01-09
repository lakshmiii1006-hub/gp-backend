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

router.put('/:id/approve', async (req, res) => {
  try {
    console.log('🚀 APPROVE REQUEST:', req.params.id);
    
    const { id } = req.params;
    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { status: 'approved', approvedAt: new Date() },
      { new: true }
    );

    console.log('📋 BOOKING FOUND:', updatedBooking ? 'YES' : 'NO', updatedBooking?.email);

    if (!updatedBooking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // DEBUG: Log all EmailJS env vars (check Render logs)
    console.log('📧 EMAILJS KEYS:', {
      service: process.env.EMAILJS_SERVICE_ID ? 'SET' : 'MISSING',
      template: process.env.EMAILJS_TEMPLATE_ID ? 'SET' : 'MISSING', 
      public: process.env.EMAILJS_PUBLIC_KEY ? 'SET' : 'MISSING'
    });

    const emailjs = await import('@emailjs/nodejs');
    
    const result = await emailjs.send({
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

    console.log('✅ EMAIL SENT:', result);

    res.json({ success: true, message: '✅ Email sent!' });
    
  } catch (error) {
    console.error('💥 FULL ERROR:', error.message);
    console.error('💥 STACK:', error.stack);
    res.status(500).json({ error: error.message });
  }
});
