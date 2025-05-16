import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { authService } from "../../application/auth.service";
import {ResultStatus} from "../../../core/result/resultCode";


export async function refreshTokenHandler(req: Request, res: Response) {
  const refreshToken = req.refreshToken; // ✅ Берём refresh token из middleware

  if (!refreshToken) {
     res.sendStatus(HttpStatus.Unauthorized);
    return
  }

  const result = await authService.refreshToken(refreshToken); // ✅ Передаём refresh token

  if (result.status !== ResultStatus.Success) {
     res.sendStatus(HttpStatus.Unauthorized);
    return
  }

  res
      .header("Set-Cookie", result.data!.cookie)
      .status(HttpStatus.Ok)
      .send({ accessToken: result.data!.newAccessToken });
}
