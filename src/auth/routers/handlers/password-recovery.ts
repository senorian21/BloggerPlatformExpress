import { Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { RequestWithBody } from "../../../core/types/requests";
import { container } from "../../../composition-root";
import { AuthService } from "../../application/auth.service";

const authService = container.get(AuthService);

export async function passwordRecoveryHandler(
    req: RequestWithBody<{ email: string }>,
    res: Response,
) {
  await authService.passwordRecovery(req.body.email); // Игнорируем результат
  res.sendStatus(HttpStatus.NoContent); // Всегда 204
  return;
}
