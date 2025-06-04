import { Response } from "express";
import { authService } from "../../application/auth.service";
import { HttpStatus } from "../../../core/types/http-statuses";
import { RequestWithBody } from "../../../core/types/requests";
import { ResultStatus } from "../../../core/result/resultCode";

export async function newPasswordHandler(
  req: RequestWithBody<{ newPassword: string; recoveryCode: string }>,
  res: Response,
) {
  const result = await authService.newPassword(
    req.body.newPassword,
    req.body.recoveryCode,
  );
  if (result.status === ResultStatus.BadRequest) {
    res.status(HttpStatus.BadRequest).send({
      errorsMessages: [
        {
          message: "confirmation failed",
          field: "recoveryCode",
        },
      ],
    });
    return;
  }
  res.sendStatus(HttpStatus.NoContent);
  return;
}
