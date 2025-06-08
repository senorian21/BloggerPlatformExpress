import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { ResultStatus } from "../../../core/result/resultCode";
import { cookieService } from "../../adapters/cookie.service";
import {container} from "../../../composition-root";
import {AuthService} from "../../application/auth.service";

const authService = container.get(AuthService);

export async function logoutHandler(req: Request, res: Response) {
  const refreshToken = req.refreshToken;

  if (!refreshToken) {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }

  const result = await authService.logout(refreshToken);

  if (result.status !== ResultStatus.Success) {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }
  cookieService.clearRefreshTokenCookie(res);
  res.sendStatus(HttpStatus.NoContent);
}
