import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import generateToken, { cookieOptions } from "../utils/generateToken.js";

const userResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name, email and password are required");
  }

  const exists = await User.findOne({ email });
  if (exists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({ name, email, password });
  generateToken(res, user._id);
  res.status(201).json(userResponse(user));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({ email }).select("+password");

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.json(userResponse(user));
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

export const logout = (req, res) => {
  res.cookie("jwt", "", { ...cookieOptions, maxAge: 0 });
  res.json({ message: "Logged out" });
};

export const getMe = (req, res) => {
  res.json(userResponse(req.user));
};