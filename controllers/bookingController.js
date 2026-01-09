// backend/controllers/bookingController.js
import Booking from "../models/Booking.js";
import Inbox from "../models/Inbox.js"; // ✅ make sure Inbox.js exists

export const createBooking = async (req, res) => {
  try {
    const booking = await Booking.create(req.body);
    const bookingIdShort = booking._id.toString().slice(-6);

    // User inbox message
    const userMessage = {
      userEmail: booking.email,
      title: `Booking Confirmed! 🌸 ID: ${bookingIdShort}`,
      message: `Hello ${booking.name}, your booking for ${booking.eventType} on ${new Date(
        booking.eventDate
      ).toDateString()} has been confirmed!`,
      type: "booking",
    };

    // Admin inbox message
    const adminMessage = {
      userEmail: "admin@flowerdecor.com", // your admin email or id
      title: `New Booking Received - ${bookingIdShort}`,
      message: `Booking from ${booking.name} (${booking.email}) for ${booking.eventType} on ${new Date(
        booking.eventDate
      ).toDateString()}.`,
      type: "booking",
    };

    await Inbox.create([userMessage, adminMessage]);

    res.status(201).json({
      message: "Booking created successfully!",
      bookingId: bookingIdShort,
    });
  } catch (error) {
    console.error("❌ Booking error:", error);
    res.status(500).json({ message: error.message });
  }
};
