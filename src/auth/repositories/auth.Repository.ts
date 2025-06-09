import { injectable } from "inversify";
import {session, SessionModel} from "../domain/auth.entity";

@injectable()
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
    await SessionModel.insertOne(session);
  }

  async updateSession(
    sessionExists: session,
    newIssuedAt: string,
    newExpiresAt: string,
  ) {
    await SessionModel.updateOne(
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

    return await SessionModel.findOne(query);
  }

  async deleteSessionByDeviceId(
    userId: string,
    deviceId: string,
  ): Promise<boolean> {
    const result = await SessionModel.deleteOne({ userId, deviceId });
    return result.deletedCount === 1;
  }

  async deleteSession(sessionId: string) {
    await SessionModel.deleteOne({ _id: sessionId });
  }

  async deleteDevice(deviceId: string, userId: string) {
    await SessionModel.deleteMany({
      $and: [{ userId: userId }, { deviceId: { $ne: deviceId } }],
    });
  }
}
