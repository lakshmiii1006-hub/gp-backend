import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "gp_events", // This creates a folder in your Cloudinary media library
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

// Create the middleware with the 10MB limit
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

export default upload;