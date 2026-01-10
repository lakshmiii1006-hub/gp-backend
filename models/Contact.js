// models/Contact.js - FIXED
import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    emailSent: { type: Boolean, default: false },  // ✅ ADDED
    read: { type: Boolean, default: false },       // ✅ ADDED
  },
  { timestamps: true }
);

export default mongoose.model("Contact", contactSchema);
