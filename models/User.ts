import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "organizer"],
      default: "user",
    },
    description: {
      type: String,
      default: "",
    },
    refreshToken: {
      type: String,
      default: null,
    },
    bookedEvents: [
      {
        eventId: {
          type: Schema.Types.ObjectId,
          ref: "Event",
        },
        bookedAt: {
          type: Date,
          default: Date.now,
        },
        numberOfSeats: {
          type: Number,
          default: 1,
        },
      },
    ],
    attendedEvents: [
      {
        eventId: {
          type: Schema.Types.ObjectId,
          ref: "Event",
        },
        attendedAt: {
          type: Date,
        },
      },
    ],
    createdEvents: [
      {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = models.User || model("User", UserSchema);

export default User;
