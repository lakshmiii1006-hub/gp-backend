import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Name is required'] 
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email']
  },
  phone: { 
    type: String, 
    required: [true, 'Phone is required'],
    match: [/^\d{10}$/, 'Phone must be 10 digits']
  },
  service: { 
    type: String, 
    required: [true, 'Service is required'] 
  },
  eventDate: { 
    type: Date, 
    required: [true, 'Event date is required']
  },
  message: { 
    type: String, 
    default: ''
  },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'completed', 'cancelled'], 
    default: 'pending' 
  }
}, { 
  timestamps: true 
});

export default mongoose.model('Booking', bookingSchema);
