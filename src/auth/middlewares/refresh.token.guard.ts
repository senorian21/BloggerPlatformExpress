import { Request, Response, NextFunction } from "express";
import { jwtService } from "../adapters/jwt.service";
import { IdType } from "../../core/types/id";
import { RefreshToken } from "../types/tokens";
import { authRepositories } from "../repositories/auth.Repository";
import { session } from "../types/session";

export const refreshTokenGuard = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) {
    res.sendStatus(401);
    return;
  }

  const cookies = cookieHeader.split(";").reduce(
    (acc, cookie) => {
      const [key, value] = cookie.trim().split("=");
      acc[key] = value;
      return acc;
    },
    {} as Record<string, string>,
  );

  const refreshToken = cookies["refreshToken"];
  if (!refreshToken) {
    res.sendStatus(401);
    return;
  }

  const payload = (await jwtService.verifyRefreshToken(
    refreshToken,
  )) as RefreshToken;
  if (!payload || !payload.userId) {
    res.sendStatus(401);
    return;
  }

  const expirationTime = payload.iat?.toString();

  const foundSession = await authRepositories.findSessionByDeviceNameAndUserId(
    payload.deviceName,
    payload.userId,
  );
  if (!foundSession) {
    res.sendStatus(401);
    return;
  }

  if (expirationTime !== foundSession.createdAt) {
    res.sendStatus(401);
    return;
  }

  req.user = { id: payload.userId } as IdType;
  req.refreshToken = refreshToken;

  next();
};
