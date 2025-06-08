import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { ResultStatus } from "../../../core/result/resultCode";
import { cookieService } from "../../adapters/cookie.service";
import {container} from "../../../composition-root";
import {AuthService} from "../../application/auth.service";

const authService = container.get(AuthService);

export async function refreshTokenHandler(req: Request, res: Response) {
  const refreshToken = req.refreshToken;
  const ip =
    req.socket.remoteAddress ||
    (Array.isArray(req.headers["x-forwarded-for"])
      ? req.headers["x-forwarded-for"][0]
      : req.headers["x-forwarded-for"]) ||
    "unknown";
  const userAgent = req.headers["user-agent"] || "unknown";

  const result = await authService.refreshToken(refreshToken!, ip, userAgent);

  if (result.status !== ResultStatus.Success) {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }

  cookieService.clearRefreshTokenCookie(res);

  cookieService.setRefreshTokenCookie(res, result.data!.newRefreshToken);

  res.status(HttpStatus.Ok).send({ accessToken: result.data!.newAccessToken });
}
