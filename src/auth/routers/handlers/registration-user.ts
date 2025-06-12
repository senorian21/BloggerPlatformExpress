import { Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { ResultStatus } from "../../../core/result/resultCode";
import { RequestWithBody } from "../../../core/types/requests";
import { registrationDto } from "../../types/registration.dto";
import { container } from "../../../composition-root";
import { AuthService } from "../../application/auth.service";

const authService = container.get(AuthService);

export async function registrationUserHandler(
    req: RequestWithBody<registrationDto>,
    res: Response,
) {
  const { login, email, password } = req.body;

  const result = await authService.registerUser(login, password, email);

  if (result.status === ResultStatus.BadRequest) {
     res.status(HttpStatus.BadRequest).json({
      errorsMessages: result.extensions.map((ext) => ({
        message: ext.message,
        field: ext.field,
      })),
    });
    return
  }

  res.sendStatus(HttpStatus.NoContent);
}
