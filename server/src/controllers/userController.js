import User from "../models/User.js";

function formatPublicProfile(user) {
  return {
    id: user._id,
    displayName: user.displayName,
    username: user.username,
    avatar: user.avatar || "",
    bio: user.bio || "",
    isVerified: user.isVerified,
    isFoundingCreator: user.isFoundingCreator,
    createdAt: user.createdAt,
  };
}

export async function getPublicProfile(req, res) {
  try {
    const username = req.params.username.toLowerCase();

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    return res.status(200).json({
      user: formatPublicProfile(user),
    });
  } catch (error) {
    console.error("Get public profile error:", error);

    return res.status(500).json({
      message: "Unable to load this profile.",
    });
  }
}

export async function updateMyProfile(req, res) {
  try {
    const allowedFields = ["displayName", "bio", "avatar"];
    const updates = {};

    for (const field of allowedFields) {
      if (Object.hasOwn(req.body, field)) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "Provide at least one profile field to update.",
      });
    }

    if (
      Object.hasOwn(updates, "displayName") &&
      (typeof updates.displayName !== "string" ||
        !updates.displayName.trim() ||
        updates.displayName.trim().length > 50)
    ) {
      return res.status(400).json({
        message: "Display name must be between 1 and 50 characters.",
        field: "displayName",
      });
    }

    if (
      Object.hasOwn(updates, "bio") &&
      (typeof updates.bio !== "string" || updates.bio.length > 160)
    ) {
      return res.status(400).json({
        message: "Bio must be 160 characters or fewer.",
        field: "bio",
      });
    }

    if (
      Object.hasOwn(updates, "avatar") &&
      (typeof updates.avatar !== "string" || updates.avatar.length > 2048)
    ) {
      return res.status(400).json({
        message:
          "Avatar must be a valid string no longer than 2048 characters.",
        field: "avatar",
      });
    }

    if (typeof updates.displayName === "string") {
      updates.displayName = updates.displayName.trim();
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    return res.status(200).json({
      message: "Profile updated successfully.",
      user: formatPublicProfile(user),
    });
  } catch (error) {
    console.error("Update profile error:", error);

    return res.status(500).json({
      message: "Unable to update your profile.",
    });
  }
}
