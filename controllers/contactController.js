import Contact from "../models/Contact.js";

// CREATE contact (called from frontend form)
export const createContact = async (req, res) => {
  try {
    const contact = await Contact.create(req.body);
    res.status(201).json(contact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET all contacts (admin)
export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE contact
export const deleteContact = async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: "Contact deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// controllers/contactController.js - ADD THIS FUNCTION
export const markReadContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id, 
      { read: true }, 
      { new: true }
    );
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
