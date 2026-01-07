import express from "express";
import { upload } from "../middlewares/uploadMiddleware.js";
import {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
} from "../controllers/serviceController.js";

const router = express.Router();

// GET all services
router.get("/", getServices);

// GET single service
router.get("/:id", getServiceById);

// CREATE service
router.post("/", upload.single("image"), createService);

// UPDATE service
router.put("/:id", upload.single("image"), updateService);

// DELETE service
router.delete("/:id", deleteService);

export default router;
