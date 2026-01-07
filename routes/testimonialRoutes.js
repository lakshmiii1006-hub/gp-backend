import express from "express";
import {
  createTestimonial,
  getTestimonials,
  approveTestimonial,
  deleteTestimonial,
} from "../controllers/testimonialController.js";

const router = express.Router();

router.post("/", createTestimonial);
router.get("/", getTestimonials);
router.put("/:id/approve", approveTestimonial);
router.delete("/:id", deleteTestimonial);

export default router;
