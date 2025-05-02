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

  const result = await authService.loginUser(loginOrEmail, password);
  if (result.status !== ResultStatus.Success) {
    res.sendStatus(HttpStatus.Unauthorized)
  }

  if (!result.data ) {
     res.sendStatus(HttpStatus.NotFound);
    return
  }

  res.status(HttpStatus.Ok).send({ accessToken: result.data.accessToken });
  return;
}
