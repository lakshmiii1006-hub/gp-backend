import Contact from "../models/Contact.js";

// CREATE contact message
export const createContact = async (req, res) => {
  try {
    const contact = await Contact.create(req.body);

    const io = req.app.get("io");
    io.emit("new_contact", contact); // emit to admin panel

    res.status(201).json(contact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET all messages
export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET single message
export const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: "Contact not found" });
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE message (mark as read)
export const updateContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: "Contact not found" });

    if (req.body.name) contact.name = req.body.name;
    if (req.body.email) contact.email = req.body.email;
    if (req.body.message) contact.message = req.body.message;
    if (req.body.isRead !== undefined) contact.isRead = req.body.isRead;

    await contact.save();
    res.json(contact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE message
export const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: "Contact not found" });

    await contact.deleteOne();
    res.json({ message: "Contact deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN replies to user
export const replyContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: "Contact not found" });

    const reply = { text: req.body.text };
    contact.replies.push(reply);
    await contact.save();

    const io = req.app.get("io");
    io.emit("new_reply", { contactId: contact._id, reply });

    res.json(contact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
