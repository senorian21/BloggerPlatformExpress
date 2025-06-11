import { injectable } from "inversify";
import { session, SessionModel } from "../domain/auth.entity";

@injectable()
export class AuthRepositories {
  async updateOrCreateSession(session: session) {
    const existingSession = await SessionModel.findOne({
      userId: session.userId,
      deviceId: session.deviceId,
    });
    if (existingSession) {
      await this.updateSession(
        existingSession._id,
        session.createdAt,
        session.expiresAt!,
      );
    } else {
      await this.createSession(session);
    }
  }

  async createSession(session: session) {
    const sessionInstance = new SessionModel(session);
    await sessionInstance.save();
  }

  async updateSession(
    sessionId: string,
    newIssuedAt: string,
    newExpiresAt: string,
  ) {
    const sessionInstance = await SessionModel.findOne({ _id: sessionId });
    if (!sessionInstance) {
      return false;
    }
    sessionInstance.createdAt = newIssuedAt;
    sessionInstance.expiresAt = newExpiresAt;
    await sessionInstance.save();
    return true;
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
