const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { validateSignUpData } = require("../utils/validator");

const authRouter = express.Router();

// -------------------- SIGNUP --------------------
authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });
    const savedUser = await user.save();

    const token = await savedUser.getJWT();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000), // 8 hours
      httpOnly: true,
      sameSite: "lax",
    });

    res.status(201).json({
      message: "User registered successfully",
      data: savedUser,
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(400).json({
      message: err.message || "Signup failed",
    });
  }
});

// -------------------- LOGIN --------------------
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = await user.getJWT();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 900000),
      httpOnly: true,
      sameSite: "lax",
    });

    res.json({
      message: "Login successful",
      data: user,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: err.message || "Login failed" });
  }
});

// -------------------- LOGOUT --------------------
authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, { expires: new Date(0) });
  res.json({ message: "Logged out successfully" });
});

module.exports = authRouter;
