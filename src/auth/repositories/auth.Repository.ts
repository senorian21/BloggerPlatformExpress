import { sessionCollection } from "../../db/mongo.db";
import { session } from "../types/session";

export const authRepositories = {
  async updateOrCreateSession(session: session) {
    const existingSession = await authRepositories.findSession(session);
    if (existingSession) {
      await authRepositories.updateSession(
        existingSession,
        session.createdAt,
        session.expiresAt!,
      );
    } else {
      await authRepositories.createSession(session);
    }
  },

  async createSession(session: session) {
    await sessionCollection.insertOne(session);
  },

  async findSession(session: session) {
    const existingSession = await sessionCollection.findOne({
      userId: session.userId,
      deviceId: session.deviceId,
    });
    return existingSession;
  },

  async updateSession(
    sessionExists: session,
    newIssuedAt: string,
    newExpiresAt: string,
  ) {
    await sessionCollection.updateOne(
      { _id: sessionExists._id },
      { $set: { createdAt: newIssuedAt, expiresAt: newExpiresAt } },
    );
  },

  async deleteSession(sessionId: string) {
    await sessionCollection.deleteOne({ _id: sessionId });
  },

  async findSessionByDeviceNameAndUserId(deviceName: string, userId: string) {
    const existingSession = await sessionCollection.findOne({
      userId: userId,
      deviceName: deviceName,
    });
    return existingSession;
  },

  async findSessionByDeviceId(deviceId: string) {
    return await sessionCollection.findOne({ deviceId: deviceId });
  },

  async deleteSessionByDeviceId(
    userId: string,
    deviceId: string,
  ): Promise<boolean> {
    const result = await sessionCollection.deleteOne({ userId, deviceId });
    return result.deletedCount === 1;
  },

  async deleteDevice(deviceId: string, userId: string) {
    await sessionCollection.deleteMany({
      $and: [{ userId: userId }, { deviceId: { $ne: deviceId } }],
    });
  },
};
