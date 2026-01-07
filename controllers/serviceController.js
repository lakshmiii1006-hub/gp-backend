import Service from "../models/Service.js";
import cloudinary from "../config/cloudinary.js";

// GET ALL
export const getServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ONE
export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service)
      return res.status(404).json({ message: "Service not found" });

    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE
export const createService = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name)
      return res.status(400).json({ message: "Name is required" });

    if (!req.file)
      return res.status(400).json({ message: "Image is required" });

    const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString(
      "base64"
    )}`;

    const upload = await cloudinary.uploader.upload(fileStr, {
      folder: "services",
    });

    const service = await Service.create({
      name,
      description,
      imageUrl: upload.secure_url,
    });

    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
export const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service)
      return res.status(404).json({ message: "Service not found" });

    // Update fields
    service.name = req.body.name || service.name;
    service.description = req.body.description || service.description;

    // If new image uploaded → replace
    if (req.file) {
      // Delete old image
      if (service.imageUrl) {
        const publicId = service.imageUrl
          .split("/")
          .pop()
          .split(".")[0];

        await cloudinary.uploader.destroy(`services/${publicId}`);
      }

      const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString(
        "base64"
      )}`;

      const upload = await cloudinary.uploader.upload(fileStr, {
        folder: "services",
      });

      service.imageUrl = upload.secure_url;
    }

    await service.save();
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE
export const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service)
      return res.status(404).json({ message: "Service not found" });

    // Remove image from Cloudinary
    if (service.imageUrl) {
      const publicId = service.imageUrl
        .split("/")
        .pop()
        .split(".")[0];

      await cloudinary.uploader.destroy(`services/${publicId}`);
    }

    await service.deleteOne();
    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
