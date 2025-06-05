import { sessionCollection } from "../../db/mongo.db";
import { session } from "../types/session";
import { ObjectId } from "mongodb";

export class AuthRepositories {
  async updateOrCreateSession(session: session) {
    const existingSession = await this.findSession({
      userId: session.userId,
      deviceId: session.deviceId,
    });
    if (existingSession) {
      await this.updateSession(
        existingSession,
        session.createdAt,
        session.expiresAt!,
      );
    } else {
      await this.createSession(session);
    }
  }

  async createSession(session: session) {
    await sessionCollection.insertOne(session);
  }

  async updateSession(
    sessionExists: session,
    newIssuedAt: string,
    newExpiresAt: string,
  ) {
    await sessionCollection.updateOne(
      { _id: sessionExists._id },
      { $set: { createdAt: newIssuedAt, expiresAt: newExpiresAt } },
    );
  }

  async findSession(filters: {
    userId?: string;
    deviceId?: string;
    deviceName?: string;
  }): Promise<session | null> {
    const query: any = {};

    if (filters.userId) {
      query.userId = filters.userId;
    }
    if (filters.deviceId) query.deviceId = filters.deviceId;
    if (filters.deviceName) query.deviceName = filters.deviceName;

    return await sessionCollection.findOne(query);
  }

  async deleteSessionByDeviceId(
    userId: string,
    deviceId: string,
  ): Promise<boolean> {
    const result = await sessionCollection.deleteOne({ userId, deviceId });
    return result.deletedCount === 1;
  }

  async deleteSession(sessionId: string) {
    await sessionCollection.deleteOne({ _id: sessionId });
  }

  async deleteDevice(deviceId: string, userId: string) {
    await sessionCollection.deleteMany({
      $and: [{ userId: userId }, { deviceId: { $ne: deviceId } }],
    });
  }
}
