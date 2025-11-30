import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  capacity: number; // Maximum number of attendees
  posterImage?: string;
  attendees: mongoose.Types.ObjectId[]; // List of attendees
  availableSeats: number; // Number of available seats
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    capacity: { type: Number, required: true },
    posterImage: { type: String },
    attendees: [{ type: Schema.Types.ObjectId, ref: "User" }],
    availableSeats: {
      type: Number,
      default: function (this: IEvent) {
        return this.capacity;
      },
    },
  },
  { timestamps: true }
);

EventSchema.index({ date: 1 });

const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);

export default Event;
