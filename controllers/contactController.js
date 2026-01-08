import Contact from "../models/Contact.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// GET all chats (admin)
export const getContacts = async (req, res) => {
  const contacts = await Contact.find().sort({ updatedAt: -1 });
  res.json(contacts);
};

// GET chat by email
export const getContactByEmail = async (req, res) => {
  const contact = await Contact.findOne({ email: req.params.email });
  res.json(contact);
};
