import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { authService } from "../../application/auth.service";
import {ResultStatus} from "../../../core/result/resultCode";


export async function logoutHandler(req: Request, res: Response) {
    const refreshToken = req.refreshToken;

    if (!refreshToken) {
        res.sendStatus(HttpStatus.Unauthorized);
        return
    }

    const result = await authService.logout(refreshToken);

    if (result.status !== ResultStatus.Success) {
        res.sendStatus(HttpStatus.Unauthorized);
        return
    }

    res.sendStatus(HttpStatus.NoContent)

}
