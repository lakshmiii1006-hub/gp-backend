// server.js
import "./config/env.js"; // MUST be first (loads process.env)

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer"; // Added to handle specific upload errors

// Routes
import serviceRoutes from "./routes/serviceRoutes.js";
import testimonialRoutes from "./routes/testimonialRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";

const app = express();

/* ===================== MIDDLEWARES ===================== */
app.use(cors());

// INCREASED LIMITS: Set to 10mb to handle high-res images and large payloads
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

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

/* ===================== GLOBAL ERROR HANDLER ===================== */
// This catches Multer errors (like 'File too large') and sends a clean message to React
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "Image is too large. Max limit is 10MB." });
    }
    return res.status(400).json({ message: err.message });
  }
  
  const statusCode = err.status || 500;
  res.status(statusCode).json({ 
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === 'production' ? null : err.stack 
  });
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