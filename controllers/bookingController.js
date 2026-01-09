import Booking from "../models/Booking.js";
import nodemailer from "nodemailer";

// Create a new booking (customer submits form)
export const createBooking = async (req, res) => {
  try {
    const { name, email, phone, service, date, additionalDetails } = req.body;

    const booking = await Booking.create({
      name,
      email,
      phone,
      service,
      date,
      additionalDetails,
      status: "pending",
      read: false,
      emailSent: false,
    });

    // Optional: notify admin via email here if you want
    // ...

    res.status(201).json({ success: true, booking });
  } catch (err) {
    console.error("Create booking error:", err);
    res.status(500).json({ success: false, message: "Booking creation failed" });
  }
};

// Update booking (admin approves/rejects)
export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'approved' or 'rejected'

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    booking.status = status;

    // If admin approves and email not yet sent, send email to customer
    if (status === "approved" && !booking.emailSent) {
      // configure transporter
      const transporter = nodemailer.createTransport({
        service: "gmail", // or your preferred email service
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: booking.email,
        subject: "Your Booking is Approved 🌸",
        html: `
          <h2>Hello ${booking.name},</h2>
          <p>Your booking for <strong>${booking.service}</strong> on <strong>${new Date(
          booking.date
        ).toLocaleDateString()}</strong> has been <strong>approved</strong>.</p>
          <p>Thank you for choosing us! We look forward to serving you.</p>
        `,
      };

      await transporter.sendMail(mailOptions);
      booking.emailSent = true;
    }

    await booking.save();
    res.status(200).json({ success: true, booking });
  } catch (err) {
    console.error("Update booking error:", err);
    res.status(500).json({ success: false, message: "Booking update failed" });
  }
};

// Mark as read (when admin views the booking)
export const markRead = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    booking.read = true;
    await booking.save();
    res.status(200).json({ success: true, booking });
  } catch (err) {
    console.error("Mark read error:", err);
    res.status(500).json({ success: false, message: "Failed to mark read" });
  }
};

// Get all bookings
export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, bookings });
  } catch (err) {
    console.error("Get bookings error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch bookings" });
  }
};
