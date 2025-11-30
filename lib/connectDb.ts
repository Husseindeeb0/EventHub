// lib/connectDb.ts
import mongoose, { Mongoose } from "mongoose";

/**
 * Ensure MONGODB_URI is defined at module load time so TypeScript treats it as string.
 */
const MONGODB_URI: string = (() => {
  const val = process.env.MONGODB_URI;
  if (!val || val.trim().length === 0) {
    throw new Error("❌ MONGODB_URI is not defined in .env.local");
  }
  return val;
})();

declare global {
  // eslint-disable-next-line no-var
  var _mongooseConnection: Promise<Mongoose> | undefined;
}

const options: mongoose.ConnectOptions = {
  bufferCommands: false,
};

export async function connectDb(): Promise<Mongoose> {
  if (global._mongooseConnection) {
    return global._mongooseConnection;
  }

  global._mongooseConnection = mongoose.connect(MONGODB_URI, options) as Promise<Mongoose>;
  return global._mongooseConnection;
}

export default connectDb;
