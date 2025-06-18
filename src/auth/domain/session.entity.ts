import mongoose, { HydratedDocument, model, Model } from "mongoose";

export class sessionEntity {
  constructor(
    public userId: string,
    public createdAt: Date,
    public expiresAt: Date,
    public deviceId: string,
    public ip: string,
    public deviceName: string,
    public deletedAt: Date,
  ) {}
  static createSession(
    userId: string,
    iat: number,
    exp: number,
    deviceId: string,
    ip: string,
    deviceName: string,
  ) {
    const newSession = new SessionModel();
    newSession.userId = userId;
    newSession.createdAt = new Date(iat * 1000);
    newSession.expiresAt = new Date(exp * 1000);
    newSession.deviceId = deviceId;
    newSession.deviceName = deviceName;
    newSession.ip = ip;
    return newSession;
  }
  updateSession(iat: number, exp: number) {
    this.createdAt = new Date(iat * 1000);
    this.expiresAt = new Date(exp * 1000);
  }
  deleteSession() {
    this.deletedAt = new Date();
  }
  static async deleteOtherDevices(
    userId: string,
    currentDeviceId: string,
  ): Promise<void> {
    await SessionModel.updateMany(
      {
        $and: [
          { userId },
          { deviceId: { $ne: currentDeviceId } },
          { deletedAt: null },
        ],
      },
      { deletedAt: new Date() },
    );
  }
}

interface sessionMethods {
  updateSession(iat: number, exp: number): void;
  deleteSession(): void;
}

type sessionStatic = typeof sessionEntity;

type sessionModelType = Model<sessionEntity, {}, sessionMethods> &
  sessionStatic;

export type sessionDocument = HydratedDocument<sessionEntity, sessionMethods>;

const sessionSchema = new mongoose.Schema<sessionEntity>({
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

sessionSchema.loadClass(sessionEntity);

export const SessionModel = model<sessionEntity, sessionModelType>(
  "session",
  sessionSchema,
);
