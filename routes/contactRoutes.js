import express from "express";
import {
  createContact,
  getContacts,
  deleteContact,
  markReadContact
} from "../controllers/contactController.js";

const router = express.Router();

router.post("/", createContact);
router.get("/", getContacts);
router.delete("/:id", deleteContact);
router.put("/:id", markReadContact);

export default router;
