import express from "express";
import {
  createTestimonial,
  getTestimonials,
  getPendingTestimonials,
  approveTestimonial,
  deleteTestimonial,
} from "../controllers/testimonialController.js";

const router = express.Router();

router.post("/", createTestimonial);                    // Public submit
router.get("/", getTestimonials);                       // Public: approved only
router.get("/pending", getPendingTestimonials);         // Admin: pending only
router.put("/:id/approve", approveTestimonial);         // Admin approve
router.delete("/:id", deleteTestimonial);               // Admin delete

export default router;
