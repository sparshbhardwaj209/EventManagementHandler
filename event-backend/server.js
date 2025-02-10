import express from 'express';
import connectDB from "./config/db.js";
import "dotenv/config";
const PORT = process.env.PORT || 5000;


const app = express();
// const server = createServer(app);

connectDB();

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
