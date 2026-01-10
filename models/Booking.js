const mongoose = require('mongoose');

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

module.exports = mongoose.model('Booking', bookingSchema);
