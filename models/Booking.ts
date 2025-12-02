import mongoose, { Schema, model, models } from "mongoose";

const BookingSchema = new Schema(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Booking = models.Booking || model("Booking", BookingSchema);

export default Booking;
