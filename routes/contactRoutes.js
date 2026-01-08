import express from "express";
import { getContacts, getContactByEmail } from "../controllers/contactController.js";

const router = express.Router();

router.get("/", getContacts);
router.get("/:email", getContactByEmail);

export default router;
