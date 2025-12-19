import mongoose, { Schema, model, models, Document } from "mongoose";

export interface IEvent extends Document {
  organizerId: string;
  title: string;
  location?: string;
  startsAt?: Date;
  coverImageUrl?: string;
  coverImageFileId?: string;
  capacity?: number;
  availableSeats?: number;
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
    coverImageFileId: {
      type: String,
    },
    capacity: {
      type: Number,
    },
    availableSeats: {
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

if (models.Event) {
  delete models.Event;
}

const Event = model<IEvent>("Event", EventSchema);

export default Event;
