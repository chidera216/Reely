import mongoose from "mongoose";
import Comment from "../models/Comment.js";
import Post from "../models/Post.js";

// GET /api/posts/:postId/comments
// Fetch comments and their replies for a public post.
export async function getComments(req, res) {
  try {
    const { postId } = req.params;

    if (!mongoose.isValidObjectId(postId)) {
      return res.status(400).json({
        message: "Invalid post ID.",
      });
    }

    const post = await Post.findOne({
      _id: postId,
      visibility: "public",
    }).select("allowComments");

    if (!post) {
      return res.status(404).json({
        message: "Public post not found.",
      });
    }

    if (post.allowComments === false) {
      return res.status(403).json({
        message: "Comments are disabled for this post.",
      });
    }

    const comments = await Comment.find({
      post: postId,
      parentComment: null,
    })
      .populate("creator", "username displayName avatar")
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    const commentIds = comments.map((comment) => comment._id);

    const replies = await Comment.find({
      post: postId,
      parentComment: { $in: commentIds },
    })
      .populate("creator", "username displayName avatar")
      .sort({ createdAt: 1 })
      .lean();

    const repliesByParent = new Map();

    for (const reply of replies) {
      const parentId = reply.parentComment.toString();

      if (!repliesByParent.has(parentId)) {
        repliesByParent.set(parentId, []);
      }

      repliesByParent.get(parentId).push(reply);
    }

    const formattedComments = comments.map((comment) => ({
      ...comment,
      replies: repliesByParent.get(comment._id.toString()) || [],
    }));

    return res.status(200).json({
      comments: formattedComments,
      commentsCount: await Comment.countDocuments({
        post: postId,
      }),
    });
  } catch (error) {
    console.error("Get comments error:", error.message);

    return res.status(500).json({
      message: "Failed to fetch comments.",
    });
  }
}

// POST /api/posts/:postId/comments
// Create a comment or reply.
export async function createComment(req, res) {
  try {
    const { postId } = req.params;
    const { text, parentComment = null } = req.body;

    if (!mongoose.isValidObjectId(postId)) {
      return res.status(400).json({
        message: "Invalid post ID.",
      });
    }

    if (typeof text !== "string" || !text.trim()) {
      return res.status(400).json({
        message: "Comment text is required.",
      });
    }

    if (text.trim().length > 1000) {
      return res.status(400).json({
        message: "Comments must be 1,000 characters or fewer.",
      });
    }

    const post = await Post.findOne({
      _id: postId,
      visibility: "public",
    }).select("allowComments");

    if (!post) {
      return res.status(404).json({
        message: "Public post not found.",
      });
    }

    if (post.allowComments === false) {
      return res.status(403).json({
        message: "Comments are disabled for this post.",
      });
    }

    // If this is a reply, ensure its parent exists on this post.
    if (parentComment !== null) {
      if (!mongoose.isValidObjectId(parentComment)) {
        return res.status(400).json({
          message: "Invalid parent comment ID.",
        });
      }

      const parent = await Comment.findOne({
        _id: parentComment,
        post: postId,
        parentComment: null,
      });

      if (!parent) {
        return res.status(404).json({
          message: "Parent comment not found.",
        });
      }
    }

    const comment = await Comment.create({
      post: postId,
      creator: req.user._id,
      text: text.trim(),
      parentComment,
    });

    await comment.populate("creator", "username displayName avatar");

    return res.status(201).json({
      message: parentComment
        ? "Reply added successfully."
        : "Comment added successfully.",
      comment: {
        ...comment.toObject(),
        replies: [],
      },
      commentsCount: await Comment.countDocuments({
        post: postId,
      }),
    });
  } catch (error) {
    console.error("Create comment error:", error.message);

    return res.status(500).json({
      message: "Failed to create comment.",
    });
  }
}

// DELETE /api/posts/:postId/comments/:commentId
// Delete your own comment or reply.
export async function deleteComment(req, res) {
  try {
    const { postId, commentId } = req.params;

    if (
      !mongoose.isValidObjectId(postId) ||
      !mongoose.isValidObjectId(commentId)
    ) {
      return res.status(400).json({
        message: "Invalid post or comment ID.",
      });
    }

    const comment = await Comment.findOne({
      _id: commentId,
      post: postId,
      creator: req.user._id,
    });

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found or you cannot delete it.",
      });
    }

    // If deleting a top-level comment, delete its replies too.
    if (comment.parentComment === null) {
      await Comment.deleteMany({
        post: postId,
        parentComment: comment._id,
      });
    }

    await comment.deleteOne();

    return res.status(200).json({
      message: "Comment deleted successfully.",
      commentsCount: await Comment.countDocuments({
        post: postId,
      }),
    });
  } catch (error) {
    console.error("Delete comment error:", error.message);

    return res.status(500).json({
      message: "Failed to delete comment.",
    });
  }
}
