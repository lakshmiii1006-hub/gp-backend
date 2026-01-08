import "./config/env.js";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import nodemailer from "nodemailer";

import serviceRoutes from "./routes/serviceRoutes.js";
import testimonialRoutes from "./routes/testimonialRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import Contact from "./models/Contact.js";

const app = express();
const server = http.createServer(app);

// ================= MIDDLEWARES =================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= SOCKET.IO =================
const io = new Server(server, {
  cors: {
    origin: "*", // change to frontend URL later
    methods: ["GET", "POST"],
  },
});
app.set("io", io);

// ================= EMAIL =================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ================= SOCKET EVENTS =================
io.on("connection", (socket) => {
  console.log("⚡ New client connected:", socket.id);

  // USER ONLINE
  socket.on("user_online", async ({ email, name }) => {
    let contact = await Contact.findOne({ email });

    if (!contact) {
      contact = await Contact.create({
        email,
        name,
        messages: [],
      });
    }

    contact.isUserOnline = true;
    await contact.save();

    io.emit("user_status", { email, online: true });
  });

  // SEND MESSAGE
  socket.on("send_message", async ({ email, text, sender }) => {
    const contact = await Contact.findOne({ email });
    if (!contact) return;

    const message = {
      text,
      sender,
      delivered: true,
      read: sender === "admin",
    };

    contact.messages.push(message);

    if (sender === "user") {
      contact.unreadCount += 1;
    }

    await contact.save();

    io.emit("new_message", { email, message });

    // EMAIL NOTIFICATION (admin replied while user offline)
    if (sender === "admin" && !contact.isUserOnline) {
      await transporter.sendMail({
        to: contact.email,
        subject: "📩 New Message from Support",
        text: text,
      });
    }
  });

  // READ RECEIPTS
  socket.on("message_read", async ({ email }) => {
    const contact = await Contact.findOne({ email });
    if (!contact) return;

    contact.messages.forEach((m) => (m.read = true));
    contact.unreadCount = 0;

    await contact.save();

    io.emit("read_update", { email });
  });

  // DISCONNECT
  socket.on("disconnect", async () => {
    console.log("❌ Client disconnected:", socket.id);

    // OPTIONAL: mark all users offline (simple version)
    await Contact.updateMany({}, { isUserOnline: false });
  });
});

// ================= ROUTES =================
app.use("/api/services", serviceRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/events", eventRoutes);

// ================= HEALTH CHECK =================
app.get("/", (req, res) =>
  res.send("Flower Backend API + Real-time Chat Running 🌸")
);

// ================= DATABASE =================
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    server.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
