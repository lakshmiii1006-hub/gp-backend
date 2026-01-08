import Contact from "../models/Contact.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// CREATE contact (user sends message)
export const createContact = async (req, res) => {
  try {
    const contact = await Contact.create({
      name: req.body.name,
      email: req.body.email,
      messages: [{ text: req.body.message, sender: "user" }],
    });

    const io = req.app.get("io");
    io.emit("new_contact", contact);

    res.status(201).json(contact);
  } catch (err) {
    console.error("Create contact error:", err);
    res.status(500).json({ message: "Failed to create contact" });
  }
};

// GET all contacts (admin)
export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    console.error("Get contacts error:", err);
    res.status(500).json({ message: "Failed to fetch contacts" });
  }
};

// REPLY to contact (admin)
export const replyContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: "Not found" });

    const reply = { text: req.body.text, sender: "admin" };
    contact.messages.push(reply);
    await contact.save();

    const io = req.app.get("io");
    io.emit("new_reply", { contactId: contact._id, reply });

    // SEND EMAIL TO USER always
    await transporter.sendMail({
      to: contact.email,
      subject: "📩 New reply from GP Flower Decorators",
      text: `Hi ${contact.name},\n\nYou have a new reply:\n"${req.body.text}"\n\n- GP Flower Decorators Support`,
    });

    res.json(contact);
  } catch (err) {
    console.error("Reply contact error:", err);
    res.status(500).json({ message: "Reply failed" });
  }
};

// DELETE contact (admin)
export const deleteContact = async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error("Delete contact error:", err);
    res.status(500).json({ message: "Delete failed" });
  }
};
