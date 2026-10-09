import Post from "../models/Post.js";
import mongoose from "mongoose";

// GET /api/posts
// Fetch the latest public posts
export async function getPosts(req, res) {
  try {
    const posts = await Post.find({ visibility: "public" })
      .populate(
        "creator",
        "username displayName avatar isVerified isFoundingCreator",
      )
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    const formattedPosts = posts.map((post) => ({
      ...post,
      likesCount: post.likes?.length ?? 0,
      isLiked: req.user
        ? (post.likes ?? []).some(
            (userId) => userId.toString() === req.user._id.toString(),
          )
        : false,
    }));

    return res.status(200).json({ posts: formattedPosts });
  } catch (error) {
    console.error("Get posts error:", error.message);

    return res.status(500).json({
      message: "Failed to fetch posts.",
    });
  }
}

// POST /api/posts
// Create a post using an existing video URL
export async function createPost(req, res) {
  try {
    const { videoUrl, caption = "", mediaType = "video" } = req.body;

    if (typeof videoUrl !== "string" || !videoUrl.trim()) {
      return res.status(400).json({
        message: "A video URL is required.",
      });
    }

    if (typeof caption !== "string" || caption.length > 500) {
      return res.status(400).json({
        message: "Caption must be 500 characters or fewer.",
      });
    }

    if (!["video", "image"].includes(mediaType)) {
      return res.status(400).json({
        message: "Media type must be video or image.",
      });
    }

    const post = await Post.create({
      creator: req.user._id,
      videoUrl: videoUrl.trim(),
      caption: caption.trim(),
      mediaType,
    });

    await post.populate(
      "creator",
      "username displayName avatar isVerified isFoundingCreator",
    );

    return res.status(201).json({
      message: "Post created successfully.",
      post,
    });
  } catch (error) {
    console.error("Create post error:", error.message);

    return res.status(500).json({
      message: "Failed to create post.",
    });
  }
}

// POST /api/posts/upload
// Save an uploaded video and its post details
export async function createUploadedPost(req, res) {
  let savedPost;

  try {
    const {
      caption = "",
      visibility = "public",
      allowComments = "true",
    } = req.body;

    if (!req.file) {
      return res.status(400).json({
        message: "Please select a video to upload.",
      });
    }

    if (typeof caption !== "string" || caption.trim().length > 500) {
      return res.status(400).json({
        message: "Caption must be 500 characters or fewer.",
      });
    }

    if (!["public", "private"].includes(visibility)) {
      return res.status(400).json({
        message: "Invalid post visibility.",
      });
    }

    const videoUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    savedPost = await Post.create({
      creator: req.user._id,
      videoUrl,
      caption: caption.trim(),
      mediaType: "video",
      visibility,
      allowComments: allowComments !== "false",
    });

    await savedPost.populate(
      "creator",
      "username displayName avatar isVerified isFoundingCreator",
    );

    return res.status(201).json({
      message: "Your video was published successfully.",
      post: savedPost,
    });
  } catch (error) {
    console.error("Create uploaded post error:", error.message);

    // Remove the uploaded file if saving the post failed.
    if (req.file && !savedPost) {
      const fs = await import("node:fs/promises");
      const path = await import("node:path");

      await fs
        .unlink(path.resolve("uploads", req.file.filename))
        .catch(() => {});
    }

    return res.status(500).json({
      message: "Failed to publish your video.",
    });
  }
}

// POST /api/posts/:postId/like
export async function likePost(req, res) {
  try {
    const { postId } = req.params;

    if (!mongoose.isValidObjectId(postId)) {
      return res.status(400).json({ message: "Invalid post ID." });
    }

    const post = await Post.findOneAndUpdate(
      { _id: postId, visibility: "public" },
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );

    if (!post) {
      return res.status(404).json({
        message: "Public post not found.",
      });
    }

    return res.status(200).json({
      likesCount: post.likes.length,
      isLiked: true,
    });
  } catch (error) {
    console.error("Like post error:", error.message);

    return res.status(500).json({
      message: "Failed to like post.",
    });
  }
}

// DELETE /api/posts/:postId/like
export async function unlikePost(req, res) {
  try {
    const { postId } = req.params;

    if (!mongoose.isValidObjectId(postId)) {
      return res.status(400).json({ message: "Invalid post ID." });
    }

    const post = await Post.findOneAndUpdate(
      { _id: postId, visibility: "public" },
      { $pull: { likes: req.user._id } },
      { new: true },
    );

    if (!post) {
      return res.status(404).json({
        message: "Public post not found.",
      });
    }

    return res.status(200).json({
      likesCount: post.likes.length,
      isLiked: false,
    });
  } catch (error) {
    console.error("Unlike post error:", error.message);

    return res.status(500).json({
      message: "Failed to unlike post.",
    });
  }
}
