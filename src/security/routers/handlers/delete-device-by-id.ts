import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { ResultStatus } from "../../../core/result/resultCode";
import { securityService } from "../../../composition-root";

export async function deleteDeviceByDeviceIdHandler(
  req: Request,
  res: Response,
): Promise<void> {
  const userId = req.user?.id;
  const refreshToken = req.refreshToken;
  const deviceId = req.params.deviceId;

  if (!userId || !refreshToken) {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }

  const deleteSessions = await securityService.deleteSessionsByDeviceId(
    refreshToken,
    deviceId,
  );
  if (deleteSessions.status === ResultStatus.Unauthorized) {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }
  if (deleteSessions.status === ResultStatus.NotFound) {
    res.sendStatus(HttpStatus.NotFound);
    return;
  }
  if (deleteSessions.status === ResultStatus.Forbidden) {
    res.sendStatus(HttpStatus.Forbidden);
    return;
  }
  res.sendStatus(HttpStatus.NoContent);
}
