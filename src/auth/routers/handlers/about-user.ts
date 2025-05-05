import { Request, Response } from "express";
import {HttpStatus} from "../../../core/types/http-statuses";
import {authService} from "../../application/auth.service";
import {userQueryRepository} from "../../../users/repositories/users.queryRepository";



export async function aboutUserHandler(req: Request, res: Response) {
    const header = req.headers.authorization;

    const userIdResult = await authService.userId(header!);
    if (!userIdResult || !userIdResult.data) {
        res.sendStatus(HttpStatus.Unauthorized);
        return;
    }

    const user = await userQueryRepository.findUserByIdForAboutUser(userIdResult.data);

    res.status(HttpStatus.Ok).send(user);
}
