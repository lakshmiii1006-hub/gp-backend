import Booking from "../models/Booking.js";
import sendMail from "../utils/sendMail.js";

/* ================= CREATE ================= */
export const createBooking = async (req, res) => {
  try {
    const booking = await Booking.create(req.body);
    const bookingIdShort = booking._id.toString().slice(-6);

    console.log(`
🚀 NEW BOOKING #${bookingIdShort}
👤 ${booking.name}
📧 ${booking.email}
📞 ${booking.phone}
🎉 ${booking.service}
📅 ${new Date(booking.eventDate).toLocaleDateString()}
💬 ${booking.message}
    `);

    res.status(201).json({
      message: "Booking created successfully",
      bookingId: bookingIdShort,
    });
  } catch (error) {
    console.error("🚨 CREATE ERROR:", error);
    res.status(500).json({ message: "Failed to create booking" });
  }
};

/* ================= READ ================= */
export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Not found" });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= UPDATE (EMAIL ON CONFIRM) ================= */
export const updateBooking = async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Not found" });

    const prevStatus = booking.status;
    booking.status = status || booking.status;
    await booking.save();

    // 📧 EMAIL ONLY WHEN CONFIRMED
    if (status === "confirmed" && prevStatus !== "confirmed") {
      await sendMail({
        to: booking.email,
        subject: "🎉 Booking Confirmed – Flower Decor",
        html: `
          <h2>Hello ${booking.name},</h2>
          <p>Your booking has been <strong>confirmed</strong> 🌸</p>
          <p><strong>Service:</strong> ${booking.service}</p>
          <p><strong>Date:</strong> ${new Date(booking.eventDate).toDateString()}</p>
          <p>We look forward to decorating your event!</p>
          <br/>
          <p>— Flower Decor Team</p>
        `,
      });

      console.log(`📧 Confirmation email sent to ${booking.email}`);
    }

    res.json(booking);
  } catch (error) {
    console.error("🚨 UPDATE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ================= DELETE ================= */
export const deleteBooking = async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
