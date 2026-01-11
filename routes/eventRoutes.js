import express from "express";
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent
} from "../controllers/eventController.js";
import upload from "../middleware/upload.js"; // <--- Import your multer config

const router = express.Router();

// Add the middleware 'upload.single("image")' to the POST and PUT routes
// "image" must match the name used in your frontend: fd.append("image", image)
router.post("/", upload.single("image"), createEvent);
router.get("/", getEvents);
router.get("/:id", getEventById);
router.put("/:id", upload.single("image"), updateEvent);
router.delete("/:id", deleteEvent);

export default router;