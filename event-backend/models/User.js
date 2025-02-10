import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true 
    },
    password: { type: String },
    role: { 
        type: String, 
        enum: ["user", "guest"], 
        default: "user" 
    },
});

export default mongoose.model("User", userSchema);
