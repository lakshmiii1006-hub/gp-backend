import express from "express";
import {
  createContact,
  getContacts,
  replyContact,
  deleteContact,
} from "../controllers/contactController.js";

const router = express.Router();

// CREATE contact (USER)
router.post("/", createContact);

// GET all contacts (ADMIN)
router.get("/", getContacts);

// REPLY (ADMIN)
router.put("/:id/reply", replyContact);

// DELETE (ADMIN)
router.delete("/:id", deleteContact);

export default router;
