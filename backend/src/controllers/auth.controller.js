import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../lib/cloudinary.js";

// create JWT
const createToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// ================= SIGNUP =================
export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "Email already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    fullName,
    email,
    password: hashedPassword,
  });

  const token = createToken(user._id);

  // ✅ SET COOKIE
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  // ✅ ALWAYS RETURN { user }
  res.status(201).json({
    user: {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    },
    token,
  });
};

// ================= LOGIN =================
export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = createToken(user._id);

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  // ✅ SAME RESPONSE SHAPE
  res.status(200).json({
    user: {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    },
    token,
  });
};

// ================= LOGOUT =================
export const logout = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 0,
  });
  res.status(200).json({ message: "Logged out successfully" });
};

// ================= CHECK AUTH =================
export const checkAuth = (req, res) => {
  res.status(200).json({
    user: req.user,
  });
};

// ================= UPDATE PROFILE =================
export const updateProfile = async (req, res) => {
  const { profilePic } = req.body;
  const userId = req.user._id;

  const uploadResponse = await cloudinary.uploader.upload(profilePic);

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { profilePic: uploadResponse.secure_url },
    { new: true }
  ).select("-password");

  res.status(200).json({ user: updatedUser });
};
