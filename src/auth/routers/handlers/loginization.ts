import { Request, Response } from "express";
import { authService } from "../../application/auth.service";
import { HttpStatus } from "../../../core/types/http-statuses";
import {User} from "../../../users/types/user";
import {WithId} from "mongodb";

export async function loginizationHandler(req: Request, res: Response) {
    const loginOrEmail = await authService.isEmail(req.body.loginOrEmail);

    let user: WithId<User> | null;
    if (loginOrEmail) {
        user = await authService.findByEmail(req.body.loginOrEmail);
    } else {
        user = await authService.findByLogin(req.body.loginOrEmail);
    }

    if (!user) {
        res.sendStatus(HttpStatus.Unauthorized);
        return;
    }

    const isPasswordValid = await authService.verifyPassword(user.password, req.body.password);

    if (isPasswordValid) {
        res.sendStatus(HttpStatus.NoContent);
    } else {
        res.status(HttpStatus.Unauthorized).send();
    }
}
