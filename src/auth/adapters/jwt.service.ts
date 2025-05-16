import jwt from "jsonwebtoken";
import { appConfig } from "../../core/settings/settings";

const timestamp = Date.now().toString();

export const jwtService = {
  async createToken(userId: string): Promise<string> {
    return jwt.sign({ userId }, appConfig.AC_SECRET_ACCESS_TOKEN, {
      expiresIn: appConfig.AC_TIME_ACCESS_TOKEN,
    } as jwt.SignOptions);
  },

  async createRefreshToken(
    userId: string,
  ): Promise<{ token: string; cookie: string }> {
    const refreshToken = jwt.sign(
      {
        userId,
      },
      appConfig.AC_SECRET_REFRESH_TOKEN,
      {
        expiresIn: appConfig.AC_TIME_REFRESH_TOKEN,
      } as jwt.SignOptions,
    );

    // Формат Set-Cookie заголовка
    const cookie = `refreshToken=${refreshToken}; HttpOnly; Secure; Path=/; Max-Age=20`;

    return { token: refreshToken, cookie };
  },

  async verifyToken(token: string): Promise<{ userId: string } | null> {
    try {
      return jwt.verify(token, appConfig.AC_SECRET_ACCESS_TOKEN) as {
        userId: string;
      };
    } catch (error) {
      console.error("Token verify some error");
      return null;
    }
  },

  async verifyRefreshToken(token: string): Promise<{ userId: string } | null> {
    try {
      const payload = jwt.verify(token, appConfig.AC_SECRET_REFRESH_TOKEN) as { userId: string };
      return payload;
    } catch (error: any) {
      // Теперь видим точную причину ошибки
      console.error("JWT verification failed:", {
        message: error.message,
        name: error.name,
        expiredAt: error.expiredAt,
      });

      return null;
    }
  }
};
