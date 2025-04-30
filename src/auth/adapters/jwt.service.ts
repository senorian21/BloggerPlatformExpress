import jwt from "jsonwebtoken";
import {appConfig} from "../../core/settings/settings";


export const jwtService = {
  async createToken(userId: string): Promise<string> {
    return jwt.sign({ userId }, appConfig.AC_SECRET, {
      expiresIn: appConfig.AC_TIME,
    } as jwt.SignOptions);
  },
};
