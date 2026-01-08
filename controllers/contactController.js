import Contact from "../models/Contact.js";
import nodemailer from "nodemailer";

// Email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// CREATE contact message
export const createContact = async (req, res) => {
  try {
    const contact = await Contact.create(req.body);
    const io = req.app.get("io");

    // Real-time notification to admin
    io.emit("new_contact", contact);

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

// UPDATE (mark read)
export const updateContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: "Contact not found" });

    contact.isRead = req.body.isRead ?? contact.isRead;
    await contact.save();
    res.json(contact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE
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

// ADMIN reply
export const replyContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: "Contact not found" });

    const reply = { text: req.body.text, createdAt: new Date() };
    contact.replies.push(reply);
    await contact.save();

    const io = req.app.get("io");
    io.emit("new_reply", { contactId: contact._id, reply, email: contact.email });

    // Send email if user offline
    if (contact.email) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: contact.email,
        subject: "Admin replied to your message",
        html: `<p>Hello ${contact.name},</p>
               <p>Admin replied: ${reply.text}</p>
               <p>Visit the website to continue chatting.</p>`,
      });
    }

    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
