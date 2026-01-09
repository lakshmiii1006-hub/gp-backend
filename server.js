// server.js
import "./config/env.js"; // MUST be first (loads process.env)

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

// Routes
import serviceRoutes from "./routes/serviceRoutes.js";
import testimonialRoutes from "./routes/testimonialRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";

import sendMail from "./utils/sendMail.js";


const app = express();

/* ===================== MIDDLEWARES ===================== */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ===================== ROUTES ===================== */
app.use("/api/services", serviceRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/events", eventRoutes);

/* ===================== HEALTH CHECK ===================== */
app.get("/", (req, res) => {
  res.send("🌸 Flower Backend API is running");
});

app.get("/test-email", async (req, res) => {
  try {
    await sendMail({
      to: "gpflowerdecorators@gmail.com", // 👈 PUT YOUR REAL EMAIL
      subject: "Resend Test Email",
      html: "<h1>Resend is working 🎉</h1>",
    });

    res.send("✅ Email sent successfully");
  } catch (error) {
    console.error("❌ EMAIL ERROR:", error);
    res.status(500).send("❌ Email failed");
  }
});


/* ===================== DATABASE + SERVER ===================== */
const PORT = process.env.PORT || 5000;

if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is missing in environment variables");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });
