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





const app = express();

/* ===================== MIDDLEWARES ===================== */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ===================== ROUTES ===================== */
app.use("/api/services", serviceRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/contacts", contactRoutes);

/* ===================== HEALTH CHECK ===================== */
app.get("/", (req, res) => {
  res.send("🌸 Flower Backend API is running");
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
