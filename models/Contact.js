import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  text: String,
  sender: { type: String, enum: ["user", "admin"] },
  delivered: { type: Boolean, default: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const contactSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },

    messages: [messageSchema],

    isUserOnline: { type: Boolean, default: false },
    unreadCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model("Contact", contactSchema);
