import { RefreshToken } from "../types/refresh-token";
import { refreshTokenCollection } from "../../db/mongo.db";

export const authRepositories = {
  async addRefreshTokenBlackList(refreshToken: RefreshToken) {
    await refreshTokenCollection.insertOne(refreshToken);
  },

  async findTokenByBlackList(tokenHash: string): Promise<RefreshToken | null> {
    return await refreshTokenCollection.findOne({ tokenHash });
  },
};
