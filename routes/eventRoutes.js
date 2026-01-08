import express from "express";
import upload from "../middlewares/uploadMiddleware.js";
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent
} from "../controllers/eventController.js";

const router = express.Router();

// CREATE / UPDATE use multer
router.post("/", upload.single("image"), createEvent);
router.put("/:id", upload.single("image"), updateEvent);

router.get("/", getEvents);
router.get("/:id", getEventById);
router.delete("/:id", deleteEvent);

export default router;
