// controllers/bookingController.js
import Booking from "../models/Booking.js";
import nodemailer from "nodemailer";

export const updateBooking = async (req, res) => {
  const { id } = req.params;
  const { status, markRead } = req.body;

  try {
    // Find the booking
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Update status if provided
    if (status) booking.status = status;

    // Update read/unread if provided
    if (typeof markRead === "boolean") booking.read = markRead;

    let emailSent = false;

    // Send email to customer when admin approves
    if (status === "confirmed" && !booking.emailSent) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: booking.email,
        subject: "Your Booking is Confirmed ✅",
        html: `
          <h2>Hi ${booking.name},</h2>
          <p>Your booking for <strong>${booking.service}</strong> on <strong>${new Date(booking.eventDate).toLocaleDateString()}</strong> has been confirmed by the admin.</p>
          <p>Booking ID: <strong>#${booking._id.toString().slice(-6)}</strong></p>
          <p>We look forward to making your event special! 🎉</p>
        `,
      };

      try {
        await transporter.sendMail(mailOptions);
        emailSent = true;
        booking.emailSent = true;
      } catch (err) {
        console.error("Failed to send email:", err);
      }
    }

    await booking.save();
    res.json({ success: true, booking, emailSent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
