import mongoose from "mongoose";

export type session = {
  _id?: string;
  userId: string;
  createdAt: string;
  expiresAt?: string;
  deviceId: string;
  ip: string;
  deviceName: string;
};

const sessionSchema = new mongoose.Schema<session>({
  userId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: String,
    required: true,
  },
  deviceId: {
    type: String,
    required: true,
  },
  deviceName: {
    type: String,
    required: true,
  },
  ip: {
    type: String,
    required: true,
  },
});

export const SessionModel = mongoose.model("session", sessionSchema);
