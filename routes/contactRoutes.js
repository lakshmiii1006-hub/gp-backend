import express from "express";
import {
  createContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact
} from "../controllers/contactController.js";

const router = express.Router();

router.post("/", createContact);         // Create contact message
router.get("/", getContacts);           // Get all messages
router.get("/:id", getContactById);     // Get single message
router.put("/:id", updateContact);      // Update message (e.g., mark as read)
router.delete("/:id", deleteContact);   // Delete message

export default router;
