// models/Booking.js - COMPLETE FIXED FILE
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true },
  phone: { type: String, required: true },
  service: { type: String, required: true },
  eventDate: { type: Date, required: true },
  message: String,
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'cancelled'], 
    default: 'pending' 
  }
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;  // ✅ FIXED - ES6 default export
