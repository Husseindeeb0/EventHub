import mongoose, { Schema, Document, Model } from "mongoose";

/**
 * Booking Details Interface
 * Stores information about who booked a specific event
 * Used within Event's bookings array and Organizer's myEvents
 */
export interface IBookingDetails {
  userId: mongoose.Types.ObjectId; // Reference to User who booked
  userName: string; // User's name for quick access
  userEmail: string; // User's email for contact
  seatsBooked: number; // Number of seats this user booked
  bookedAt: Date; // When the booking was made
}

/**
 * Booking Details Schema
 * Embedded schema for storing individual booking information
 */
export const BookingDetailsSchema = new Schema<IBookingDetails>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    seatsBooked: {
      type: Number,
      required: true,
      min: [1, "Must book at least 1 seat"],
    },
    bookedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false } // Don't create separate _id for embedded documents
);

/**
 * Organizer Event Interface
 * Stores event reference with booking information for organizers
 * Used in User model's myEvents field
 */
export interface IOrganizerEvent {
  eventId: mongoose.Types.ObjectId; // Reference to Event document
  bookings: IBookingDetails[]; // Array of all bookings for this event
  totalSeatsBooked: number; // Quick reference to total booked seats
}

/**
 * Organizer Event Schema
 * Embedded schema for organizer's events with booking tracking
 */
export const OrganizerEventSchema = new Schema<IOrganizerEvent>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    bookings: [BookingDetailsSchema], // Array of booking details
    totalSeatsBooked: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { _id: false }
);

/**
 * Event Interface
 * Main event document structure
 * This will be extended by the Events team with additional fields
 */
export interface IEvent extends Document {
  // Basic event information (to be filled by Events team)
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  capacity: number;
  posterImage?: string;

  // Organizer reference
  organizerId: mongoose.Types.ObjectId;

  // Booking tracking
  bookings: IBookingDetails[]; // All users who booked this event
  availableSeats: number; // Calculated: capacity - total booked seats

  createdAt: Date;
  updatedAt: Date;
}

/**
 * Event Schema
 * NOTE: This is a basic structure for the authentication module
 * The Events team will extend this with additional fields and validation
 */
const EventSchema = new Schema<IEvent>(
  {
    // Basic fields - to be extended by Events team
    title: {
      type: String,
      required: [true, "Event title is required"],
    },
    description: {
      type: String,
      required: [true, "Event description is required"],
    },
    date: {
      type: Date,
      required: [true, "Event date is required"],
    },
    time: {
      type: String,
      required: [true, "Event time is required"],
    },
    location: {
      type: String,
      required: [true, "Event location is required"],
    },
    capacity: {
      type: Number,
      required: [true, "Event capacity is required"],
      min: [1, "Capacity must be at least 1"],
    },
    posterImage: {
      type: String,
    },

    // Organizer reference
    organizerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Booking tracking
    bookings: [BookingDetailsSchema],

    availableSeats: {
      type: Number,
      default: function (this: IEvent) {
        return this.capacity;
      },
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Index for faster queries
 */
EventSchema.index({ organizerId: 1 });
EventSchema.index({ date: 1 });

/**
 * Event Model
 * Check if model already exists to prevent recompilation errors in development
 */
const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);

export default Event;