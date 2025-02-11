import express from 'express';
import connectDB from "./config/db.js";
import authRoutes from './routes/auth.js';

import "dotenv/config";
const PORT = process.env.PORT || 5000;


const app = express();
app.use(express.json());

// const server = createServer(app);

// Routes
app.use('/api/auth', authRoutes);

connectDB();

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
