import { Request, Response } from "express";
import { authService } from "../../application/auth.service";
import { HttpStatus } from "../../../core/types/http-statuses";
import { ResultStatus } from "../../../core/result/resultCode";
import { resultCodeToHttpException } from "../../../core/result/resultCodeToHttpException";
import { RequestWithBody } from "../../../core/types/requests";
import { LoginDto } from "../../types/login.dto";

export async function loginizationHandler(
  req: RequestWithBody<LoginDto>,
  res: Response,
) {
  const { loginOrEmail, password } = req.body;
  const ip =
    req.socket.remoteAddress ||
    (Array.isArray(req.headers["x-forwarded-for"])
      ? req.headers["x-forwarded-for"][0]
      : req.headers["x-forwarded-for"]) ||
    "unknown";
  const userAgent = req.headers["user-agent"] || "unknown";
  const result = await authService.loginUser(
    loginOrEmail,
    password,
    ip,
    userAgent,
  );
  if (result.status !== ResultStatus.Success) {
    res.sendStatus(HttpStatus.Unauthorized);
  }

  if (!result.data) {
    res.sendStatus(HttpStatus.NotFound);
    return;
  }
  res
    .header("Set-Cookie", result.data.cookie)
    .status(HttpStatus.Ok)
    .send({ accessToken: result.data.accessToken });
  return;
}
