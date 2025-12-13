import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "organizer";
  description?: string;
  refreshToken?: string;
  bookedEvents: mongoose.Types.ObjectId[]; // Events the user has booked
  attendedEvents: mongoose.Types.ObjectId[]; // Events the user has attended
  createdEvents: mongoose.Types.ObjectId[]; // Events the user has created
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
    refreshToken: { type: String, default: null },
    bookedEvents: [{ type: Schema.Types.ObjectId, ref: "Event" }],
    attendedEvents: [{ type: Schema.Types.ObjectId, ref: "Event" }],
    createdEvents: [{ type: Schema.Types.ObjectId, ref: "Event" }],
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
