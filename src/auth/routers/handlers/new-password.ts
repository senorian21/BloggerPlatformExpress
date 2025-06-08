import { Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { RequestWithBody } from "../../../core/types/requests";
import { ResultStatus } from "../../../core/result/resultCode";
import {container} from "../../../composition-root";
import {AuthService} from "../../application/auth.service";

const authService = container.get(AuthService);

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
