import express from "express";
import Event from "../models/Event.js";
import { auth } from "../middleware/auth.js";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 }, // limit file size to 500KB
});

const router = express.Router();

// Create Event
router.post("/", auth, upload.single("image"), async (req, res) => {
  let imageUrl = "";
  if (req.file) {
    const fileStr = req.file.buffer.toString("base64");
    const dataUri = `data:${req.file.mimetype};base64,${fileStr}`;

    // Upload the image to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        dataUri,
        { folder: "events", resource_type: "image" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
    });
    imageUrl = uploadResult.secure_url;
  }

  const eventData = {
    ...req.body,
    organizer: req.user._id,
    imageUrl,
  };

  const event = new Event(eventData);
  await event.save();
  res.status(201).send(event);
});

// Get all events
router.get("/", auth, async (req, res) => {
  const events = await Event.find().populate("organizer", "email");
  res.send(events);
});

// Delete particular event
router.delete("/:id", auth, async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.organizer.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this event" });
    }

    await Event.findByIdAndDelete(eventId);
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// NEW: Attend an event
router.post("/:id/attend", auth, async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    // Check if user already attending
    if (event.attendees.includes(req.user._id)) {
      return res.status(400).json({ message: "User already attending" });
    }
    event.attendees.push(req.user._id);
    await event.save();
    // Emit a socket event to notify all clients of the update
    req.app.locals.io.emit("attendeeUpdated", event);
    res.json(event);
  } catch (error) {
    console.error("Error attending event:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// NEW: Withdraw from an event
router.post("/:id/withdraw", auth, async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    // Check if user is attending
    if (!event.attendees.includes(req.user._id)) {
      return res.status(400).json({ message: "User is not attending" });
    }
    event.attendees = event.attendees.filter(
      (id) => id.toString() !== req.user._id.toString()
    );
    await event.save();
    req.app.locals.io.emit("attendeeUpdated", event);
    res.json(event);
  } catch (error) {
    console.error("Error withdrawing from event:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
