import Contact from "../models/Contact.js";

export const createContact = async (req, res) => {
  try {
    const contact = await Contact.create(req.body);

    // realtime emit
    const io = req.app.get("io");
    io.emit("new_contact", contact);

    res.status(201).json(contact);
  } catch (err) {
    console.error("Create contact error:", err);
    res.status(500).json({ message: "Failed to create contact" });
  }
};

export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch {
    res.status(500).json({ message: "Failed to fetch contacts" });
  }
};

export const replyContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: "Not found" });

    contact.replies.push({ text: req.body.text });
    await contact.save();

    const io = req.app.get("io");
    io.emit("new_reply", {
      contactId: contact._id,
      reply: req.body.text,
    });

    res.json(contact);
  } catch {
    res.status(500).json({ message: "Reply failed" });
  }
};

export const deleteContact = async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch {
    res.status(500).json({ message: "Delete failed" });
  }
};
