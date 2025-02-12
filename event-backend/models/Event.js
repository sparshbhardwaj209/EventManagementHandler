import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    imageUrl: {
      type: String,
      default: "",
    },
    attendees: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: []
    }],
  },
  { timestamps: true }
);

const Event = mongoose.model('Event', eventSchema);

export default Event;
