export const createBooking = async (req, res) => {
  try {
    console.log('🔍 RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);
    console.log('🔍 ADMIN_EMAIL exists:', !!process.env.ADMIN_EMAIL);
    
    const booking = await Booking.create(req.body);
    const bookingIdShort = booking._id.toString().slice(-6);
    
    console.log(`🌸 SENDING EMAILS for #${bookingIdShort}`);

    // Test Resend
    try {
      await resend.emails.send({
        from: 'Flower Decor <no-reply@resend.dev>',
        to: [booking.email],
        subject: `✅ Booking #${bookingIdShort}`,
        html: `<h1>Booking Confirmed!</h1>`
      });
      console.log('✅ CUSTOMER EMAIL SENT');
    } catch (emailError) {
      console.error('❌ CUSTOMER EMAIL FAILED:', emailError.message);
    }

    try {
      await resend.emails.send({
        from: 'Flower Decor <no-reply@resend.dev>',
        to: [process.env.ADMIN_EMAIL],
        subject: `🌸 New Booking #${bookingIdShort}`,
        html: `<h2>New booking from ${booking.name}</h2>`
      });
      console.log('✅ ADMIN EMAIL SENT');
    } catch (emailError) {
      console.error('❌ ADMIN EMAIL FAILED:', emailError.message);
    }

    res.status(201).json({ message: 'Booking saved!' });
  } catch (error) {
    console.error('🚨 FULL ERROR:', error);
    res.status(201).json({ message: 'Booking saved!' });
  }
};
