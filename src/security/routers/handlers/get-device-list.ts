import { Request, Response } from "express";
import { authQueryRepositories } from "../../../auth/repositories/auth.queryRepository";
import { HttpStatus } from "../../../core/types/http-statuses";

export async function getDeviceListHandler(req: Request, res: Response) {
  const userId = req.user?.id;

  if (!userId) {
    res.sendStatus(401);
    return;
  }
  const deviceList = await authQueryRepositories.deviceSessionList(userId);
  res.status(HttpStatus.Ok).send(deviceList);
}
