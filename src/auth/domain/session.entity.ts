import mongoose, { HydratedDocument } from "mongoose";

export type session = {
  userId: string;
  createdAt: Date;
  expiresAt: Date;
  deviceId: string;
  ip: string;
  deviceName: string;
  deletedAt: Date;
};

export type sessionDocument = HydratedDocument<session>;

const sessionSchema = new mongoose.Schema<session>({
  userId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  expiresAt: {
    type: Date,
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
  deletedAt: {
    type: Date,
    default: null,
  },
});

export const SessionModel = mongoose.model("session", sessionSchema);
