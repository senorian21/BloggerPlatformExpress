import { Request, Response, NextFunction } from "express";
import { IdType } from "../../core/types/id";
import { container } from "../../composition-root";
import { AuthRepositories } from "../../auth/repositories/auth.Repository";
import { JwtService } from "../../auth/adapters/jwt.service";
import { RefreshToken } from "../../auth/types/tokens";

const authRepositories = container.get(AuthRepositories);
const jwtService = container.get(JwtService);

export const authorizationVerification = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  req.user = null;

  const cookieHeader = req.headers.cookie;

  if (!cookieHeader) {
    next();
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
    next();
    return;
  }

  try {
    const payload = (await jwtService.verifyRefreshToken(
      refreshToken,
    )) as RefreshToken | null;

    if (!payload || !payload.userId || !payload.deviceName) {
      next();
      return;
    }

    const foundSession = await authRepositories.findSession({
      deviceId: payload.deviceId,
      userId: payload.userId,
    });

    if (!foundSession) {
      next();
      return;
    }

    const tokenIat = new Date(payload.iat).getTime();
    const sessionCreatedAt = new Date(foundSession.createdAt).getTime();

    if (tokenIat !== sessionCreatedAt) {
      next();
      return;
    }

    req.user = { id: payload.userId } as IdType;
    req.refreshToken = refreshToken;

    next();
    return;
  } catch (error) {
    console.error("Refresh token verification failed:", error);
    next();
    return;
  }
};
