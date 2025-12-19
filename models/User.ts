import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "organizer";
  description?: string;
  imageUrl?: string;
  imageFileId?: string;
  coverImageUrl?: string;
  coverImageFileId?: string;
  refreshToken?: string;
  bookedEvents: mongoose.Types.ObjectId[]; // Events the user has booked
  attendedEvents: mongoose.Types.ObjectId[]; // Events the user has attended
  createdEvents: mongoose.Types.ObjectId[]; // Events the user has created
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  isVerified: boolean;
  verificationToken?: string;
  verificationTokenExpire?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "organizer"], default: "user" },
    description: { type: String, trim: true },
    imageUrl: { type: String, default: "" },
    imageFileId: { type: String, default: "" },
    coverImageUrl: { type: String, default: "" },
    coverImageFileId: { type: String, default: "" },
    refreshToken: { type: String, default: null },
    bookedEvents: [{ type: Schema.Types.ObjectId, ref: "Event" }],
    attendedEvents: [{ type: Schema.Types.ObjectId, ref: "Event" }],
    createdEvents: [{ type: Schema.Types.ObjectId, ref: "Event" }],
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpire: { type: Date, default: null },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String, default: null },
    verificationTokenExpire: { type: Date, default: null },
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });

// Prevent "OverwriteModelError" (and forcing schema refresh for dev)
if (mongoose.models.User) {
  delete mongoose.models.User;
}

const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);

export default User;
