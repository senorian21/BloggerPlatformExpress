import { NextFunction, Request, Response } from "express";
import { IdType } from "../../core/types/id";
import { container } from "../../composition-root";
import { JwtService } from "../adapters/jwt.service";
import { HttpStatus } from "../../core/types/http-statuses";

const jwtService = container.get(JwtService);

export const accessTokenGuard = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.error("❌ Authorization header is missing");
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }

  const authHeaderParts = authHeader.split(" ");
  if (authHeaderParts.length !== 2 || authHeaderParts[0] !== "Bearer") {
    console.error("❌ Invalid Authorization header format");
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }

  const token = authHeaderParts[1];

  try {
    const payload = await jwtService.verifyToken(token);

    if (!payload || !payload.userId) {
      console.error("❌ Token verification failed or userId missing");
      res.sendStatus(HttpStatus.Unauthorized);
      return;
    }

    req.user = { id: payload.userId } as IdType;
    next();
  } catch (error) {
    console.error("❌ Token verification error:", error);
    res.sendStatus(HttpStatus.Unauthorized);
  }
};
