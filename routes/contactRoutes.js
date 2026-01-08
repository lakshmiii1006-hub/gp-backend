import express from "express";
import {
  createContact,
  getContacts,
  replyContact,
  deleteContact,
} from "../controllers/contactController.js";

const router = express.Router();

router.post("/", createContact);
router.get("/", getContacts);
router.put("/:id/reply", replyContact);
router.delete("/:id", deleteContact);

export default router;
