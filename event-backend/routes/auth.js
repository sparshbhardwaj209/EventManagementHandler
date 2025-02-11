import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
const JWT_SECRET = process.env.JWT_SECRET;

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    //checking if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // creating new instance of User
    const user = new User({ email, password });
    await user.save();

    //creating JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    console.log("User registered successfully");

    res.status(201).json({
      token,
      userId: user._id,
      role: user.role,
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    //finding user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send("Invalid credentials");
    }

    // if user exist now comparing passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generating JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.json({
      token,
      userId: user._id,
      role: user.role,
    });
  } catch (err) {
    res.status(500).send({ message: "Server error" });
  }
});

// Guest Login (No password)
router.post("/guest", async (req, res) => {
  try {
    const guest = new User({ role: "guest" });
    await guest.save();

    const token = jwt.sign({ userId: guest._id }, JWT_SECRET);

    res.status(201).json({
      token,
      userId: guest._id,
      role: guest.role,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
