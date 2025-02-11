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
    // Convert file buffer to a base64-encoded string
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
    imageUrl, // will be an empty string if no image was uploaded
  };

  // const event = new Event({
  //   ...req.body,
  //   organizer: req.user._id,
  // });
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
    // Optional: Only allow the organizer to delete their event
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

export default router;
