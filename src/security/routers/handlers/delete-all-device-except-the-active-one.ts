import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { ResultStatus } from "../../../core/result/resultCode";
import { container } from "../../../composition-root";
import { SecurityService } from "../../application/security.service";

const securityService = container.get(SecurityService);

export async function deleteDeviceHandler(
  req: Request,
  res: Response,
): Promise<void> {
  const userId = req.user?.id;
  const refreshToken = req.refreshToken;

  if (!userId || !refreshToken) {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }

  const deleteSessions =
    await securityService.deleteAllDeviceExceptTheActiveOne(refreshToken);
  if (deleteSessions.status !== ResultStatus.Success) {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }

  res.sendStatus(HttpStatus.NoContent);
}
