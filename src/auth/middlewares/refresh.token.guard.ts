import { Request, Response, NextFunction } from "express";
import { jwtService } from "../adapters/jwt.service";
import { IdType } from "../../core/types/id";
import { RefreshToken } from "../types/tokens";
import { authRepositories } from "../repositories/auth.Repository";
import { session } from "../types/session";
import {HttpStatus} from "../../core/types/http-statuses";

export const refreshTokenGuard = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
  // Извлекаем refresh-токен из кукис
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

  try {
    const payload = await jwtService.verifyRefreshToken(refreshToken) as RefreshToken;
    if (!payload || !payload.userId || !payload.deviceName) {
      res.sendStatus(401);
      return;
    }


    const foundSession = await authRepositories.findSession({
      deviceName: payload.deviceName,
      userId: payload.userId,
    });
    if (!foundSession) {
      res.sendStatus(HttpStatus.Unauthorized);
      return;
    }

    // Сравниваем время создания токена и сессии
    const tokenIat = payload.iat?.toString();
    const sessionCreatedAt = foundSession.createdAt.toString();

    if (tokenIat !== sessionCreatedAt) {
      console.log("Mismatch:", { tokenIat, sessionCreatedAt });
      res.sendStatus(401);
      return;
    }

    // Если всё ок — продолжаем
    req.user = { id: payload.userId } as IdType;
    req.refreshToken = refreshToken;

    next();
  } catch (error) {
    res.sendStatus(401);
  }
};
