// controllers/guestController.js
import jwt from 'jsonwebtoken';

export const guestLogin = async (req, res) => {
  try {
    const guestUser = {
      email: `guest_${Date.now()}@guest.com`,
      role: 'guest'
    };

    // Generate a token for the guest user
    const token = jwt.sign({ guest: true, email: guestUser.email }, process.env.JWT_SECRET);
    res.json({ token, user: guestUser });
  } catch (error) {
    console.error('Guest login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
