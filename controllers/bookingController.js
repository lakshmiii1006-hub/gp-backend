import Booking from "../models/Booking.js";
import sendMail from "../utils/sendMail.js";

export const updateBooking = async (req, res) => {
  try {
    const { status } = req.body;

    // Get existing booking first
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Not found" });
    }

    const previousStatus = booking.status;

    // Update fields
    booking.status = status || booking.status;
    await booking.save();

    // ✅ SEND EMAIL ONLY WHEN MOVED TO CONFIRMED
    if (status === "confirmed" && previousStatus !== "confirmed") {
      await sendMail({
        to: booking.email,
        subject: "🎉 Your Flower Decoration Booking is Confirmed!",
        html: `
          <h2>Hello ${booking.name},</h2>
          <p>Great news! Your booking has been <strong>confirmed</strong> 🌸</p>

          <p><strong>Service:</strong> ${booking.service}</p>
          <p><strong>Event Date:</strong> ${new Date(booking.eventDate).toDateString()}</p>

          <p>We’re excited to decorate your special event!</p>

          <br/>
          <p>— Flower Decor Team</p>
        `,
      });

      console.log(`📧 Confirmation email sent to ${booking.email}`);
    }

    res.json(booking);
  } catch (error) {
    console.error("🚨 Update booking error:", error);
    res.status(500).json({ message: error.message });
  }
};
