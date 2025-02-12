import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.guest) {
      // If the token indicates a guest user, attach a guest user object
      req.user = { _id: decoded.email, email: decoded.email, role: "guest" };
      return next();
    }
    
    const user = await User.findById(decoded.userId);
    
    if (!user) throw new Error();
    req.user = user;
    next();
  } catch (err) {
    res.status(401).send({ error: 'Please authenticate' });
  }
};