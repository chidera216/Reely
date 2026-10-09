import { Router } from "express";

import {
  getPosts,
  createPost,
  createUploadedPost,
  likePost,
  unlikePost,
} from "../controllers/postController.js";

import {
  getComments,
  createComment,
  deleteComment,
} from "../controllers/commentController.js";

import { requireAuth } from "../middleware/requireAuth.js";
import { optionalAuth } from "../middleware/optionalAuth.js";
import uploadVideo from "../middleware/uploadVideo.js";

const router = Router();

// Public feed
router.get("/", optionalAuth, getPosts);

// Create posts
router.post("/", requireAuth, createPost);

// Upload videos
router.post(
  "/upload",
  requireAuth,
  uploadVideo.single("video"),
  createUploadedPost,
);

// Like and unlike posts
router.post("/:postId/like", requireAuth, likePost);
router.delete("/:postId/like", requireAuth, unlikePost);

// Comments and replies
router.get("/:postId/comments", getComments);

router.post("/:postId/comments", requireAuth, createComment);

router.delete("/:postId/comments/:commentId", requireAuth, deleteComment);

export default router;
