import express from "express";
import { refreshTokenGuard } from "../../auth/middlewares/refresh.token.guard";
import { getDeviceListHandler } from "./handlers/get-device-list";
import {deleteDeviceByDeviceIdHandler} from "./handlers/delete-device-by-id";

export const securityRouter = express.Router({});

securityRouter.get("/devices", refreshTokenGuard, getDeviceListHandler);


securityRouter.delete("/devices/:deviceId", refreshTokenGuard, deleteDeviceByDeviceIdHandler);