import Event from "../models/Event.js";
import multer from 'multer';
import cloudinary from 'cloudinary';

// Configure multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Cloudinary upload helper
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload_stream(
      { 
        folder: 'flower-events',
        transformation: [
          { width: 800, height: 600, crop: 'fill' },
          { quality: 'auto' }
        ]
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    ).end(buffer);
  });
};

// CREATE with file upload
export const createEvent = [
  upload.single('image'),
  async (req, res) => {
    try {
      let imageUrl = '';
      
      // Upload image to Cloudinary if file exists
      if (req.file) {
        imageUrl = await uploadToCloudinary(req.file.buffer);
      }

      const eventData = {
        name: req.body.name,
        description: req.body.description,
        image: imageUrl || req.body.image, // Use uploaded or URL from body
        isFeatured: req.body.isFeatured === 'true' || false
      };

      const event = await Event.create(eventData);
      res.status(201).json(event);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
];

// UPDATE with file upload
export const updateEvent = [
  upload.single('image'),
  async (req, res) => {
    try {
      const event = await Event.findById(req.params.id);
      if (!event) return res.status(404).json({ message: "Event not found" });

      // Update fields
      event.name = req.body.name || event.name;
      event.description = req.body.description || event.description;
      
      // Handle image update
      if (req.file) {
        // Delete old image from Cloudinary (optional)
        // cloudinary.v2.uploader.destroy(event.public_id);
        event.image = await uploadToCloudinary(req.file.buffer);
      } else if (req.body.image) {
        event.image = req.body.image;
      }

      if (req.body.isFeatured !== undefined) {
        event.isFeatured = req.body.isFeatured === 'true';
      }

      await event.save();
      res.json(event);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
];

// GET ALL (unchanged)
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE (unchanged)
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE (unchanged)
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    await event.deleteOne();
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
