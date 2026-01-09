import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  service: { type: String, required: true },
  eventDate: { type: Date, required: true },
  message: String,
  status: { 
    type: String, 
    default: 'pending', 
    enum: ['pending', 'approved', 'rejected'] 
  },
  approvedAt: Date,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Booking', bookingSchema);
