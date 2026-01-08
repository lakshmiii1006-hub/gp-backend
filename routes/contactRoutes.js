import express from "express";
import {
  createContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact,
  replyContact,
} from "../controllers/contactController.js";

const router = express.Router();

router.post("/", createContact);           // Create contact message
router.get("/", getContacts);              // Get all messages
router.get("/:id", getContactById);        // Get single message
router.put("/:id", updateContact);         // Update message
router.delete("/:id", deleteContact);      // Delete message
router.put("/:id/reply", replyContact);    // Admin replies

export default router;
