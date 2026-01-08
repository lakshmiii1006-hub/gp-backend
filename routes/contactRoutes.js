import express from "express";
import {
  createContact,
  getContacts,
  updateContact,
  deleteContact,
  replyContact,
} from "../controllers/contactController.js";

const router = express.Router();

router.post("/", createContact);
router.get("/", getContacts);
router.put("/:id", updateContact);
router.delete("/:id", deleteContact);
router.put("/:id/reply", replyContact);

export default router;
