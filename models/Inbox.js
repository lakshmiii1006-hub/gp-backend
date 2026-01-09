// backend/models/Inbox.js
import mongoose from "mongoose";

const inboxSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false }, // mark messages as read/unread
    type: { type: String, default: "info" }, // e.g., 'booking', 'contact', 'admin'
  },
  { timestamps: true } // adds createdAt & updatedAt automatically
);

export default mongoose.model("Inbox", inboxSchema);
