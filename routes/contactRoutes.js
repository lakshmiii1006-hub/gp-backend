import express from "express";
import {
  createContact,
  getContacts,
  updateContact,
  deleteContact,
  replyContact,
} from "../controllers/contactController.js";

const router = express.Router();

router.post("/", createContact);         // create message
router.get("/", getContacts);            // get all messages
router.put("/:id", updateContact);       // mark read
router.delete("/:id", deleteContact);    // delete message
router.put("/:id/reply", replyContact);  // admin replies

export default router;
