import Contact from "../models/Contact.js";

// CREATE /api/contacts
export const createContact = async (req, res) => {
  try {
    let contact = await Contact.findOne({ email: req.body.email });

    if (!contact) {
      contact = await Contact.create({
        name: req.body.name,
        email: req.body.email,
        messages: [{ text: req.body.message, sender: "user" }],
      });
    } else {
      contact.messages.push({ text: req.body.message, sender: "user" });
      contact.unreadCount += 1;
      await contact.save();
    }

    const io = req.app.get("io");
    io.emit("new_contact", contact);

    res.status(201).json(contact);
  } catch (err) {
    console.error("Create contact error:", err);
    res.status(500).json({ message: "Failed to create contact" });
  }
};

// GET /api/contacts
export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch contacts" });
  }
};

// REPLY /api/contacts/:id/reply
export const replyContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: "Contact not found" });

    const message = {
      text: req.body.text,
      sender: "admin",
      delivered: true,
      read: false,
    };
    contact.messages.push(message);
    contact.unreadCount += 1;
    await contact.save();

    const io = req.app.get("io");
    io.emit("new_reply", { contactId: contact._id, reply: message });

    res.json(contact);
  } catch (err) {
    console.error("Reply contact error:", err);
    res.status(500).json({ message: "Failed to reply to contact" });
  }
};

// DELETE /api/contacts/:id
export const deleteContact = async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete failed" });
  }
};
