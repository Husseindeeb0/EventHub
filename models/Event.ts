import mongoose, { Schema, model, models, Document } from "mongoose";

export interface ISpeaker {
  name: string;
  title?: string;
  bio?: string;
  linkedinLink?: string;
  instagramLink?: string;
  twitterLink?: string;
  profileImageUrl?: string;
  profileImageFileId?: string;
}

export interface IScheduleItem {
  title: string;
  startTime: string;
  endTime?: string;
  date?: Date;
  presenter?: string;
  description?: string;
  type?: "session" | "break" | "opening" | "closing";
}

export interface IEvent extends Document {
  organizerId: string;
  title: string;
  location?: string;
  isOnline: boolean;
  meetingLink?: string;
  startsAt?: Date;
  endsAt?: Date;
  coverImageUrl?: string;
  coverImageFileId?: string;
  capacity?: number;
  availableSeats?: number;
  category?: string;
  description?: string;
  speakers?: ISpeaker[];
  schedule?: IScheduleItem[];
  averageRating?: number;
  ratingCount?: number;
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
    isOnline: {
      type: Boolean,
      default: false,
    },
    meetingLink: {
      type: String,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    ratingCount: {
      type: Number,
      default: 0,
    },
    location: {
      type: String,
    },
    startsAt: {
      type: Date,
    },
    endsAt: {
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
    category: {
      type: String,
      default: "Other",
    },
    description: {
      type: String,
    },
    speakers: [
      {
        name: { type: String, required: true },
        title: String,
        bio: String,
        linkedinLink: String,
        instagramLink: String,
        twitterLink: String,
        profileImageUrl: String,
        profileImageFileId: String,
      },
    ],
    schedule: [
      {
        title: { type: String, required: true },
        startTime: { type: String, required: true },
        endTime: String,
        date: Date,
        presenter: String,
        description: String,
        type: {
          type: String,
          enum: ["session", "break", "opening", "closing"],
          default: "session",
        },
      },
    ],
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
