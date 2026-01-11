import express from "express";
import { createEvent, getEvents, updateEvent, deleteEvent } from "../controllers/eventController.js";
import upload from "../middlewares/uploadMiddleware.js"; // Ensure this matches your folder structure

const router = express.Router();

// Apply the middleware to POST and PUT
router.post("/", upload.single("image"), createEvent);
router.put("/:id", upload.single("image"), updateEvent);

router.get("/", getEvents);
router.delete("/:id", deleteEvent);

export default router;