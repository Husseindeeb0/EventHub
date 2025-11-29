import mongoose, { Schema, Document, Model } from "mongoose";
import {
  IBookingDetails,
  IOrganizerEvent,
  OrganizerEventSchema,
} from "./Event";

/**
 * User interface extending Mongoose Document
 * Defines the structure of a user in the EventHub system
 *
 * A single user can be both a normal user AND an organizer
 * - As a normal user: can book events (bookedEvents, attendedEvents)
 * - As an organizer: can create events (myEvents with booking details)
 */
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "organizer";
  description?: string;
  refreshToken?: string; // Stores the current valid refresh token for this user

  // Normal User Fields (available to all users)
  bookedEvents: mongoose.Types.ObjectId[]; // Events currently booked (future/ongoing)
  attendedEvents: mongoose.Types.ObjectId[]; // Events that have finished (past events)

  // Organizer-Specific Fields (only used when role is 'organizer')
  myEvents: IOrganizerEvent[]; // Events created by this organizer with booking details

  createdAt: Date;
  updatedAt: Date;
}

/**
 * User Schema Definition
 * Defines validation rules and structure for user documents in MongoDB
 */
const UserSchema = new Schema<IUser>(
  {
    // User's full name
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },

    // User's email address (unique identifier)
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },

    // Hashed password (never store plain text passwords)
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },

    // User role: determines permissions and available features
    // 'user' - Normal user (can view and book events)
    // 'organizer' - Can create events + all user permissions
    // Note: A user can have organizer role and still book events as a normal user
    role: {
      type: String,
      enum: {
        values: ["user", "organizer"],
        message: "{VALUE} is not a valid role",
      },
      default: "user",
    },

    // Optional user description/bio
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },

    // Stores the current valid refresh token
    // Used for token refresh mechanism and invalidation on logout
    refreshToken: {
      type: String,
      default: null,
    },

    // ==================== NORMAL USER FIELDS ====================

    /**
     * Booked Events (for all users)
     * Events that the user has booked and are either:
     * - Upcoming (event date is in the future)
     * - Ongoing (event is happening now)
     *
     * When an event's date passes, it should be moved to attendedEvents
     * This is the list shown in the "My Bookings" page
     */
    bookedEvents: [
      {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    ],

    /**
     * Attended Events (for all users)
     * Events that the user booked and have already finished
     * These are past events that were in bookedEvents but the event date has passed
     *
     * This is the historical record shown in the user's profile
     * Useful for:
     * - Showing user's event history
     * - Analytics and recommendations
     * - Preventing duplicate bookings of past events
     */
    attendedEvents: [
      {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    ],

    // ==================== ORGANIZER-SPECIFIC FIELDS ====================

    /**
     * My Events (only for organizers)
     * Events created by this organizer with detailed booking information
     *
     * Uses OrganizerEventSchema from Event model
     * Each entry contains:
     * - eventId: Reference to the Event document
     * - bookings: Array of all users who booked this event
     * - totalSeatsBooked: Quick count of total seats booked
     *
     * This allows organizers to:
     * - See all their created events
     * - View who booked each event
     * - Track seat availability
     * - Contact attendees
     */
    myEvents: [OrganizerEventSchema],
  },
  {
    // Automatically add createdAt and updatedAt timestamps
    timestamps: true,
  }
);

/**
 * Index on email field for faster queries
 * Email is unique and frequently used for authentication
 */
UserSchema.index({ email: 1 });

/**
 * Index on role for filtering users by type
 */
UserSchema.index({ role: 1 });

/**
 * Compound index for organizers to quickly find their events
 */
UserSchema.index({ role: 1, "myEvents.eventId": 1 });

/**
 * User Model
 * Check if model already exists to prevent recompilation errors in development
 */
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;

// Re-export types for use in other modules
export type { IBookingDetails, IOrganizerEvent };
