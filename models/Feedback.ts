import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFeedback extends Document {
  user: mongoose.Types.ObjectId;
  booking?: mongoose.Types.ObjectId;
  type: "event" | "general";
  rating: number;
  category?: "ui" | "performance" | "features" | "bugs" | "other";
  comment?: string;
  createdAt: Date;
}

const FeedbackSchema = new Schema<IFeedback>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    booking: { type: Schema.Types.ObjectId, ref: "Booking", required: false },
    type: { type: String, enum: ["event", "general"], default: "event" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    category: { type: String, enum: ["ui", "performance", "features", "bugs", "other"], required: false },
    comment: { type: String, maxlength: 500 },
  },
  { timestamps: true }
);

FeedbackSchema.index({ user: 1 });
FeedbackSchema.index({ booking: 1 });

const Feedback: Model<IFeedback> =
  mongoose.models.Feedback ||
  mongoose.model<IFeedback>("Feedback", FeedbackSchema);

export default Feedback;
