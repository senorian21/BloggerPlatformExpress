import { Response } from "express";
import { authService } from "../../application/auth.service";
import { HttpStatus } from "../../../core/types/http-statuses";
import { RequestWithBody } from "../../../core/types/requests";

export async function passwordRecoveryHandler(
  req: RequestWithBody<{ email: string }>,
  res: Response,
) {
  const result = await authService.passwordRecovery(req.body.email);
  res.sendStatus(HttpStatus.NoContent);
  return;
}
