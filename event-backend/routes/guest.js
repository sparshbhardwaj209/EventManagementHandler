// routes/guest.js
import express from 'express';
import { guestLogin } from '../controllers/guestController.js';

const router = express.Router();

// POST /api/guest - for guest login
router.post('/', guestLogin);

export default router;
