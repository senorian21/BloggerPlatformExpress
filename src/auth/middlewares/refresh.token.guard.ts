import { Request, Response, NextFunction } from "express";
import { jwtService } from "../adapters/jwt.service";
import { IdType } from "../../core/types/id";

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

  const payload = await jwtService.verifyRefreshToken(refreshToken);
  if (!payload || !payload.userId) {
    res.sendStatus(401);
    return;
  }

  req.user = { id: payload.userId } as IdType;
  req.refreshToken = refreshToken;

  next();
};
