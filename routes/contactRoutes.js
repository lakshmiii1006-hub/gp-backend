import express from "express";
import {
  createContact,
  getContacts,
  replyContact,
  deleteContact
} from "../controllers/contactController.js";

const router = express.Router();

// USER creates contact
router.post("/", createContact);

// ADMIN gets all contacts
router.get("/", getContacts);

// ADMIN replies to contact
router.put("/:id/reply", replyContact);

// ADMIN deletes contact
router.delete("/:id", deleteContact);

export default router;
