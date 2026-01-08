import express from "express";
import {
  createTestimonial,
  getTestimonials,
  getPendingTestimonials,
  approveTestimonial,
  deleteTestimonial,
} from "../controllers/testimonialController.js";

const router = express.Router();

// PUBLIC ROUTES
router.post("/", createTestimonial);        // Submit a testimonial (starts as unapproved)
router.get("/", getTestimonials);           // Get only approved testimonials

// ADMIN ROUTES
router.get("/pending", getPendingTestimonials);    // Get pending testimonials
router.put("/:id/approve", approveTestimonial);   // Approve testimonial
router.delete("/:id", deleteTestimonial);        // Delete testimonial

export default router;
