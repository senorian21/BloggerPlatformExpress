import { Request, Response, NextFunction } from "express";
import { IdType } from "../../core/types/id";
import { container } from "../../composition-root";
import { JwtService } from "../../auth/adapters/jwt.service";

const jwtService = container.get(JwtService);

export const authorizationVerification = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  req.user = null;
  if (!req.headers.authorization) {
    next();
    return;
  }

  const authHeaderParts = req.headers.authorization.split(" ");
  if (authHeaderParts.length !== 2 || authHeaderParts[0] !== "Bearer") {
    next();
    return;
  }

  const [, token] = authHeaderParts;

  const payload = await jwtService.verifyToken(token);
  if (!payload || !payload.userId) {
    next();
    return;
  }

  req.user = { id: payload.userId } as IdType;

  next();
  return;
};
