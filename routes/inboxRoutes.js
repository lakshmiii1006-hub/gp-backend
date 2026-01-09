import express from "express";
import Inbox from "../models/Inbox.js";

const router = express.Router();

// Get messages for a specific user
router.get("/:userEmail", async (req, res) => {
  try {
    const messages = await Inbox.find({ userEmail: req.params.userEmail }).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark a message as read
router.patch("/read/:id", async (req, res) => {
  try {
    const msg = await Inbox.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    if (!msg) return res.status(404).json({ message: "Message not found" });
    res.json(msg);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
