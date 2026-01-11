import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    rating: { type: Number, min: 0, max: 5 }, // 4.8
    reviews: { type: Number, min: 0 }, // 150
    duration: String, // "4-6 hours"
    guestCapacity: String, // "50-100 guests"
    priceOriginal: { type: Number, min: 0 }, // 32500
    priceDiscounted: { type: Number, min: 0 }, // 25000
  },
  { timestamps: true }
);

export default mongoose.model("Service", serviceSchema);
