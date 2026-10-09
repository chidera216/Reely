import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const COOKIE_NAME = "reely_token";
const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

function createToken(userId) {
  return jwt.sign({ userId: userId.toString() }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
}

function getCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: THIRTY_DAYS,
    path: "/",
  };
}

function setAuthCookie(res, userId) {
  const token = createToken(userId);

  res.cookie(COOKIE_NAME, token, getCookieOptions());
}

function formatUser(user) {
  return {
    id: user._id,
    displayName: user.displayName,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    bio: user.bio,
    isVerified: user.isVerified,
    isFoundingCreator: user.isFoundingCreator,
  };
}

export async function signup(req, res) {
  try {
    const { displayName, username, email, password, dateOfBirth } = req.body;

    if (
      !displayName?.trim() ||
      !username?.trim() ||
      !email?.trim() ||
      !password ||
      !dateOfBirth
    ) {
      return res.status(400).json({
        message: "All required fields must be provided.",
      });
    }

    const normalizedDisplayName = displayName.trim();
    const normalizedUsername = username.trim().toLowerCase();
    const normalizedEmail = email.trim().toLowerCase();

    if (normalizedDisplayName.length > 50) {
      return res.status(400).json({
        message: "Display name cannot exceed 50 characters.",
      });
    }

    if (
      normalizedUsername.length > 30 ||
      !/^[a-z0-9_]+$/.test(normalizedUsername)
    ) {
      return res.status(400).json({
        message:
          "Username must contain only letters, numbers, and underscores.",
      });
    }

    if (typeof password !== "string" || password.length < 10) {
      return res.status(400).json({
        message: "Password must be at least 10 characters.",
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({
        message: "Enter a valid email address.",
      });
    }

    const dob = new Date(dateOfBirth);

    if (
      Number.isNaN(dob.getTime()) ||
      dob.toISOString().slice(0, 10) !== dateOfBirth
    ) {
      return res.status(400).json({
        message: "Enter a valid date of birth.",
      });
    }

    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();

    const beforeBirthday =
      today.getMonth() < dob.getMonth() ||
      (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate());

    if (beforeBirthday) age--;

    if (dob > today || age < 16) {
      return res.status(400).json({
        message: "You must be at least 16 years old to join Reely.",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ username: normalizedUsername }, { email: normalizedEmail }],
    });

    if (existingUser) {
      if (existingUser.username === normalizedUsername) {
        return res.status(409).json({
          message: "Username is already taken.",
          field: "username",
        });
      }

      return res.status(409).json({
        message: "An account with this email already exists.",
        field: "email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      displayName: normalizedDisplayName,
      username: normalizedUsername,
      email: normalizedEmail,
      password: hashedPassword,
      dateOfBirth: dob,
    });

    setAuthCookie(res, user._id);

    return res.status(201).json({
      message: "Account created successfully.",
      user: formatUser(user),
    });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern ?? {})[0];

      return res.status(409).json({
        message:
          field === "username"
            ? "Username is already taken."
            : "An account with this email already exists.",
        field,
      });
    }

    console.error("Signup error:", error.message);

    return res.status(500).json({
      message: "Something went wrong while creating your account.",
    });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    setAuthCookie(res, user._id);

    return res.status(200).json({
      message: "Login successful.",
      user: formatUser(user),
    });
  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      message: "Something went wrong while logging in.",
    });
  }
}

export function logout(req, res) {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return res.status(200).json({
    message: "Logged out successfully.",
  });
}

export async function getMe(req, res) {
  return res.status(200).json({
    user: formatUser(req.user),
  });
}
