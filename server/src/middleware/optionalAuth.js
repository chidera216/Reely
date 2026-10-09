import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function optionalAuth(req, res, next) {
  try {
    const token = req.cookies?.reely_token;

    if (!token) {
      return next();
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);

      if (user) {
        req.user = user;
      }
    } catch {
      // An invalid or expired cookie should not block public feed access.
    }

    return next();
  } catch (error) {
    console.error("Optional authentication error:", error.message);
    return res.status(500).json({
      message: "Something went wrong while checking authentication.",
    });
  }
}
