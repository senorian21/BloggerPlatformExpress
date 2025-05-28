import express from "express";
import {refreshTokenGuard} from "../../auth/middlewares/refresh.token.guard";
import {getDeviceListHandler} from "./handlers/get-device-list";


export const securityRouter = express.Router({});


securityRouter.get("/devices", refreshTokenGuard, getDeviceListHandler);