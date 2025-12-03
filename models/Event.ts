import mongoose, { Schema, model, models, Document } from "mongoose";

export interface IEvent extends Document {
  organizerId: string;
  title: string;
  location?: string;
  startsAt?: Date;
  coverImageUrl?: string;
  capacity?: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    organizerId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    location: {
      type: String,
    },
    startsAt: {
      type: Date,
    },
    coverImageUrl: {
      type: String,
    },
    capacity: {
      type: Number,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Event = models.Event || model<IEvent>("Event", EventSchema);

export default Event;
