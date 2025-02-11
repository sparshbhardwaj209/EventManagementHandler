import express from "express";
import User from "../models/User.js";

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

export default router;
