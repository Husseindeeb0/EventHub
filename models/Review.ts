import mongoose, { Schema, model, models, Document } from "mongoose";

export interface IReview extends Document {
  user: mongoose.Types.ObjectId;
  event: mongoose.Types.ObjectId;
  rating: number; // 1-5
  createdAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
  },
  { timestamps: true }
);

// Ensure user can rate an event only once
ReviewSchema.index({ user: 1, event: 1 }, { unique: true });

if (models.Review) {
  delete models.Review;
}

const Review = model<IReview>("Review", ReviewSchema);

export default Review;
