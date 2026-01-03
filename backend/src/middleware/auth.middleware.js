import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    fullName,
    email,
    password: hashedPassword,
  });

  generateToken(user._id, res);

  res.status(201).json({
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    profilePic: user.profilePic,
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  generateToken(user._id, res);

  res.json({
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    profilePic: user.profilePic,
  });
};

export const logout = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 0,
  });

  res.json({ message: "Logged out successfully" });
};

export const checkAuth = async (req, res) => {
  res.status(200).json(req.user);
};
