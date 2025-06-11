import { injectable } from "inversify";
import {session, sessionDocument, SessionModel} from "../domain/session.entity";

@injectable()
export class AuthRepositories {

  async findSession(filters: {
    userId?: string;
    deviceId?: string;
    deviceName?: string;
  }) {
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

  async deleteDevice(deviceId: string, userId: string) {
    await SessionModel.deleteMany({
      $and: [{ userId: userId }, { deviceId: { $ne: deviceId } }],
    });
  }
  async save(session: sessionDocument) {
    await session.save();
  }
}
