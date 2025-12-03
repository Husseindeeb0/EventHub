import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBooking extends Document {
  user: mongoose.Types.ObjectId;
  event: mongoose.Types.ObjectId;
  seats: number;
  totalPrice?: number;
  status: "confirmed" | "cancelled" | "attended";
  bookingDate: Date;
  name: string;
  email: string;
  phone: string;
}

const BookingSchema = new Schema<IBooking>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    seats: { type: Number, required: true, min: 1 },
    totalPrice: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["confirmed", "cancelled", "attended"],
      default: "confirmed",
    },
    bookingDate: { type: Date, default: Date.now },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },
  { timestamps: true }
);

BookingSchema.index({ user: 1, event: 1 });
BookingSchema.index({ event: 1 });
BookingSchema.index({ status: 1 });

const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);

export default Booking;
