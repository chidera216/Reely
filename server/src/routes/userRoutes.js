import { Router } from "express";
import {
  getPublicProfile,
  updateMyProfile,
} from "../controllers/userController.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

// Update the authenticated user's own profile.
router.patch("/me", requireAuth, updateMyProfile);

// View a public creator profile by username.
router.get("/:username", getPublicProfile);

export default router;
