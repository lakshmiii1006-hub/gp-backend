// middlewares/authMiddleware.js
import { clerkClient } from "@clerk/clerk-sdk-node";

/**
 * Middleware to protect admin routes.
 * Checks for Authorization header with Bearer token.
 */
export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1]; // "Bearer <token>"
    const session = await clerkClient.verifyToken(token);

    req.user = session; // attach user info to request
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
