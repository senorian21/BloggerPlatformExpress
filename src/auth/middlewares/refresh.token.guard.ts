import { Request, Response, NextFunction } from "express";
import { IdType } from "../../core/types/id";
import { RefreshToken } from "../types/tokens";
import { HttpStatus } from "../../core/types/http-statuses";
import { container } from "../../composition-root";
import { AuthRepositories } from "../repositories/auth.Repository";
import { JwtService } from "../adapters/jwt.service";

const authRepositories = container.get(AuthRepositories);
const jwtService = container.get(JwtService);

export const refreshTokenGuard = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) {
    res.sendStatus(HttpStatus.Unauthorized);
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
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }

  try {
    const payload = (await jwtService.verifyRefreshToken(
      refreshToken,
    )) as RefreshToken;
    if (!payload || !payload.userId || !payload.deviceName) {
      res.sendStatus(HttpStatus.Unauthorized);
      return;
    }

    const foundSession = await authRepositories.findSession({
      deviceId: payload.deviceId,
      userId: payload.userId,
    });

    if (!foundSession) {
      res.sendStatus(HttpStatus.Unauthorized);
      return;
    }

    const tokenIat = new Date(payload.iat * 1000).getTime(); // если iat в секундах
    const sessionCreatedAt = new Date(foundSession.createdAt).getTime();

    if (tokenIat !== sessionCreatedAt) {
      res.sendStatus(HttpStatus.Unauthorized);
      return;
    }

    req.user = { id: payload.userId } as IdType;
    req.refreshToken = refreshToken;

    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }
};
