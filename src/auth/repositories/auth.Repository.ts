import { RefreshToken } from "../types/refresh-token";
import {refreshTokenCollection, sessionCollection} from "../../db/mongo.db";
import {session} from "../types/session";

export const authRepositories = {
  async addRefreshTokenBlackList(refreshToken: RefreshToken) {
    await refreshTokenCollection.insertOne(refreshToken);
  },

  async findTokenByBlackList(tokenHash: string): Promise<RefreshToken | null> {
    return await refreshTokenCollection.findOne({ tokenHash });
  },

  async createSession(session:session){
    await sessionCollection.insertOne(session);
  },
  async updateOrCreateSession(session: session) {
    const existingSession = await sessionCollection.findOne({
      userId: session.userId,
      $or: [
        { deviceId: session.deviceId },
        { deviceName: session.deviceName },
      ],
    });
    if (existingSession) {
      await sessionCollection.updateOne(
          { _id: existingSession._id },
          { $set: { createdAt: session.createdAt, expiresAt: session.expiresAt } }
      );
    } else {
      await authRepositories.createSession(session);
    }
  },



};
