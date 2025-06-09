import jwt from "jsonwebtoken";
import { appConfig } from "../../core/settings/settings";
import { Token } from "../types/tokens";
import { v4 as uuidv4 } from "uuid";
import { injectable } from "inversify";
@injectable()
export class JwtService {
  async createToken(userId: string): Promise<string> {
    return jwt.sign({ userId }, appConfig.AC_SECRET_ACCESS_TOKEN, {
      expiresIn: appConfig.AC_TIME_ACCESS_TOKEN,
    } as jwt.SignOptions);
  }

  async createRefreshToken(
    userId: string,
    ip: string,
    deviceName: string,
    deviceId?: string,
  ): Promise<{ token: string; cookie: string }> {
    const actualDeviceId = deviceId || uuidv4();
    const refreshToken = jwt.sign(
      {
        userId,
        ip,
        deviceName,
        deviceId: actualDeviceId,
      },
      appConfig.AC_SECRET_REFRESH_TOKEN,
      {
        expiresIn: appConfig.AC_TIME_REFRESH_TOKEN,
      } as jwt.SignOptions,
    );

    const cookie = `refreshToken=${refreshToken}; HttpOnly; Secure; Path=/; Max-Age=20`;

    return { token: refreshToken, cookie };
  }

  async verifyJwt(token: string, secret: string): Promise<Token | null> {
    try {
      const payload = jwt.verify(token, secret) as Token;

      if (!payload || typeof payload !== "object" || !("userId" in payload)) {
        return null;
      }

      return payload;
    } catch (error: any) {
      console.error("JWT verification failed:", {
        message: error.message,
        name: error.name,
        expiredAt: error.expiredAt,
      });

      return null;
    }
  }

  async verifyToken(token: string) {
    return this.verifyJwt(token, appConfig.AC_SECRET_ACCESS_TOKEN);
  }

  async verifyRefreshToken(token: string) {
    return this.verifyJwt(token, appConfig.AC_SECRET_REFRESH_TOKEN);
  }
}
