// server.js
import "./config/env.js"; // Make sure MONGO_URI is in .env
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

// ROUTES
import serviceRoutes from "./routes/serviceRoutes.js";
import testimonialRoutes from "./routes/testimonialRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";

const app = express();
const server = http.createServer(app);

// ================= MIDDLEWARES =================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= SOCKET.IO =================
const io = new Server(server, {
  cors: {
    origin: "*", // You can restrict to your frontend URL in production
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Make io accessible in routes
app.set("io", io);

// Example: log when a client connects
io.on("connection", (socket) => {
  console.log("⚡ A client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("⚡ A client disconnected:", socket.id);
  });
});

// ================= ROUTES =================
app.use("/api/services", serviceRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/events", eventRoutes);

// ================= HEALTH CHECK =================
app.get("/", (req, res) => {
  res.send("Flower Backend API + Socket.IO Running 🌸");
});

// ================= DB CONNECTION =================
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
