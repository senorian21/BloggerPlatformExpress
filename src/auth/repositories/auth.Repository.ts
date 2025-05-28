import { RefreshToken } from "../types/refresh-token";
import {refreshTokenCollection, sessionCollection} from "../../db/mongo.db";
import {session} from "../types/session";
import {ObjectId} from "mongodb";

export const authRepositories = {
  async addRefreshTokenBlackList(refreshToken: RefreshToken) {
    await refreshTokenCollection.insertOne(refreshToken);
  },

  async findTokenByBlackList(tokenHash: string): Promise<RefreshToken | null> {
    return await refreshTokenCollection.findOne({ tokenHash });
  },

  async updateOrCreateSession(session: session) {
    const existingSession = await authRepositories.findSession(session);
    if (existingSession) {
      await authRepositories.updateSessionByLogin(existingSession, session);
    } else {
      await authRepositories.createSession(session);
    }
  },

  async updateSessionByLogin(existingSession: session, session: session) {
    await sessionCollection.updateOne(
        { _id: existingSession._id },
        { $set: { createdAt: session.createdAt, expiresAt: session.expiresAt } }
    );
  },

  async createSession(session:session){
    await sessionCollection.insertOne(session);
  },

  async findSession(session:session) {
    const existingSession = await sessionCollection.findOne({
      userId: session.userId,
      $or: [
        { deviceId: session.deviceId },
        { deviceName: session.deviceName },
      ],
    });
    return existingSession;
  },

  async updateSession(sessionExists: session, newIssuedAt: string, newExpiresAt: string) {
    await sessionCollection.updateOne(
        { _id: sessionExists._id },
        { $set: { createdAt: newIssuedAt, expiresAt: newExpiresAt } }
    );
  },

  async deleteSession(sessionId: string) {
    await sessionCollection.deleteOne({ _id: sessionId });
  }


};
