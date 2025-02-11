import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: function () {
        return this.role !== "guest";
      },
      lowercase: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: function () {
        return this.role !== "guest";
      },
      minLength: [6, "Password must be at least 6 characters long"],
    },
    role: {
      type: String,
      enum: ["user", "guest"],
      default: "user",
    },
  },
  { timestamps: true }
);

// Hashing password before saving
userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
