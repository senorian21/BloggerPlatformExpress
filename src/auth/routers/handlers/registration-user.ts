import { Response } from "express";
import { authService } from "../../application/auth.service";
import { HttpStatus } from "../../../core/types/http-statuses";
import { ResultStatus } from "../../../core/result/resultCode";
import { RequestWithBody } from "../../../core/types/requests";
import { registrationDto } from "../../types/registration.dto";

export async function registrationUserHandler(
  req: RequestWithBody<registrationDto>,
  res: Response,
) {
  const { login, email, password } = req.body;
  const result = await authService.registerUser(login, password, email);

  if (result.status !== ResultStatus.Success) {
    res.status(HttpStatus.BadRequest).json({
      errorsMessages: [
        {
          message: "Invalid value",
          field: "email or login",
        },
      ],
    });
    return;
  }
  res.sendStatus(HttpStatus.Created);
}
