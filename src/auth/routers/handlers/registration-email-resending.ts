import { Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { RequestWithBody } from "../../../core/types/requests";
import { ResultStatus } from "../../../core/result/resultCode";
import { authService } from "../../../composition-root";

export async function registrationEmailResendingUserHandler(
  req: RequestWithBody<{ email: string }>,
  res: Response,
) {
  const { email } = req.body;
  const registrationConfirmationUser =
    await authService.registrationEmailResending(email);

  if (registrationConfirmationUser.status !== ResultStatus.Success) {
    res.status(HttpStatus.BadRequest).json({
      errorsMessages: [
        {
          message: "confirmation failed",
          field: "email",
        },
      ],
    });
    return;
  }

  res.sendStatus(HttpStatus.NoContent);
  return;
}
