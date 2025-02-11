import express from "express";
import User from "../models/User.js";
import bcrypt from 'bcrypt';

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = new User({ email, password });
    await user.save();
    console.log("User created successfully");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !bcrypt.compare(password, user.password)) {
      return res.status(401).send("Invalid credentials");
    }
    res.send("User logged in successfully");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

export default router;
