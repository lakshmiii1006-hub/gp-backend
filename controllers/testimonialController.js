import Testimonial from "../models/Testimonial.js";

// CREATE - Sets isApproved: false automatically
export const createTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.create({
      ...req.body,
      isApproved: false  // ✅ ALWAYS starts unapproved
    });
    res.status(201).json(testimonial);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL - ONLY APPROVED for public (homepage)
export const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isApproved: true })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();
    
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET PENDING - Only for admin panel
export const getPendingTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isApproved: false })
      .sort({ createdAt: -1 })
      .lean();
    
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ APPROVE TESTIMONIAL - MISSING FUNCTION ADDED
export const approveTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );

    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    res.json({
      message: "Testimonial approved successfully!",
      testimonial
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE
export const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    
    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }
    
    res.json({ message: "Testimonial deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
