import express from "express";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import eventRoutes from "./routes/events.js";
import "dotenv/config";
const PORT = process.env.PORT || 5000;

const app = express();


connectDB();
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
