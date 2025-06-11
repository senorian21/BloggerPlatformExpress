import { NextFunction, Request, Response } from "express";
import { IdType } from "../../core/types/id";
import { container } from "../../composition-root";
import { JwtService } from "../adapters/jwt.service";

const jwtService = container.get(JwtService);

export const accessTokenGuard = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (!req.headers.authorization) {
    res.sendStatus(401);
    return;
  }

  const authHeaderParts = req.headers.authorization.split(" ");
  if (authHeaderParts.length !== 2 || authHeaderParts[0] !== "Bearer") {
    res.sendStatus(401);
    return;
  }

  const [, token] = authHeaderParts;

  const payload = await jwtService.verifyToken(token);
  if (!payload || !payload.userId) {
    res.sendStatus(401);
    return;
  }

  req.user = { id: payload.userId } as IdType;

  next();
};
