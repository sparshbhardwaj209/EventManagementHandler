import express from "express";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import eventRoutes from "./routes/events.js";
import guestRoutes from './routes/guest.js';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
dotenv.config();
import cors from "cors";

const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    // origin: "*",
    methods: ["GET", "POST", "DELETE"],
  },
});

app.locals.io = io;

connectDB();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use('/api/guest', guestRoutes);
app.use("/api/events", eventRoutes);

// Socket.io
io.on('connection', (socket) => {
  console.log('A client connected');

  // Example event listener
  socket.on('disconnect', () => {
    console.log('A client disconnected');
  });
});


server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
