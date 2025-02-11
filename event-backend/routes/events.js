import express from 'express';
import Event from '../models/Event.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Create Event
router.post('/', auth, async (req, res) => {
  const event = new Event({
    ...req.body,
    organizer: req.user._id
  });
  await event.save();
  res.status(201).send(event);
});

// Get all events
router.get('/', auth, async (req, res) => {
  const events = await Event.find().populate('organizer', 'email');
  res.send(events);
});

export default router;