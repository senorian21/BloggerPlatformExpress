import { Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { RequestWithBody } from "../../../core/types/requests";
import { authService } from "../../../composition-root";

export async function passwordRecoveryHandler(
  req: RequestWithBody<{ email: string }>,
  res: Response,
) {
  const result = await authService.passwordRecovery(req.body.email);
  res.sendStatus(HttpStatus.NoContent);
  return;
}
