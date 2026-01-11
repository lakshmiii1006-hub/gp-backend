import Event from "../models/Event.js";

/* ===================== GET ALL EVENTS ===================== */
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch events", error: error.message });
  }
};

/* ===================== GET SINGLE EVENT ===================== */
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: "Error fetching event", error: error.message });
  }
};

/* ===================== CREATE EVENT ===================== */
export const createEvent = async (req, res) => {
  try {
    const { name, description } = req.body;

    // req.file.path is provided by the Cloudinary Storage middleware
    if (!req.file) {
      return res.status(400).json({ message: "Image is required for a new event" });
    }

    const newEvent = new Event({
      name,
      description,
      image: req.file.path, // The Cloudinary URL
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    console.error("Create Event Error:", error);
    res.status(400).json({ message: "Failed to create event", error: error.message });
  }
};

/* ===================== UPDATE EVENT ===================== */
export const updateEvent = async (req, res) => {
  try {
    const { name, description } = req.body;
    const event = await Event.findById(req.params.id);

    if (!event) return res.status(404).json({ message: "Event not found" });

    // Update text fields
    event.name = name || event.name;
    event.description = description || event.description;

    // If a new file was uploaded, update the image URL
    if (req.file) {
      event.image = req.file.path;
    }

    const updatedEvent = await event.save();
    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error("Update Event Error:", error);
    res.status(400).json({ message: "Failed to update event", error: error.message });
  }
};

/* ===================== DELETE EVENT ===================== */
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting event", error: error.message });
  }
};