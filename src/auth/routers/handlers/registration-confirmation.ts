import { Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { RequestWithBody } from "../../../core/types/requests";
import { ResultStatus } from "../../../core/result/resultCode";
import { authService } from "../../../composition-root";

export async function registrationConfirmationUserHandler(
  req: RequestWithBody<{ code: string }>,
  res: Response,
) {
  const { code } = req.body;
  const registrationConfirmationUser =
    await authService.registrationConfirmationUser(code);
  if (registrationConfirmationUser.status !== ResultStatus.Success) {
    res.status(HttpStatus.BadRequest).json({
      errorsMessages: [
        {
          message: "confirmation failed",
          field: "code",
        },
      ],
    });
    return;
  }

  res.sendStatus(HttpStatus.NoContent);
  return;
}
