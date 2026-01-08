// CREATE
export const createEvent = async (req, res) => {
  try {
    const event = await Event.create({
      name: req.body.name,
      description: req.body.description,
      isFeatured: req.body.isFeatured === "true" || req.body.isFeatured === true,
      image: req.file?.path || "",
    });

    // Emit event to all connected clients
    const io = req.app.get("io");
    io.emit("new_event", event);

    res.status(201).json(event);
  } catch (error) {
    console.error("CREATE EVENT ERROR:", error);
    res.status(400).json({ message: error.message });
  }
};

// UPDATE
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    event.name = req.body.name || event.name;
    event.description = req.body.description || event.description;
    if (req.body.isFeatured !== undefined)
      event.isFeatured = req.body.isFeatured === "true" || req.body.isFeatured === true;
    if (req.file) event.image = req.file.path;

    await event.save();

    // Emit updated event
    const io = req.app.get("io");
    io.emit("update_event", event);

    res.json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
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

