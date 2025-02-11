import express from "express";
import Event from "../models/Event.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// Create Event
router.post("/", auth, async (req, res) => {
  const event = new Event({
    ...req.body,
    organizer: req.user._id,
  });
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
