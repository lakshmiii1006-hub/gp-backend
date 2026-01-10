// models/Booking.js
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true },
  phone: { type: String, required: true },
  service: { type: String, required: true },
  eventDate: { type: Date, required: true },
  budget: { type: String },  // ✅ ADDED - matches your frontend
  message: String,
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'cancelled'], 
    default: 'pending' 
  }
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
