import { Request, Response } from "express";
import { authService } from "../../application/auth.service";
import { HttpStatus } from "../../../core/types/http-statuses";


export async function loginizationHandler(req: Request, res: Response) {
    const { loginOrEmail, password } = req.body;

    const user = await authService.checkUserloginOrEmail(loginOrEmail);
    if (!user) {
         res.sendStatus(HttpStatus.Unauthorized);
        return;
    }
    const verifyPassword = await authService.verifyPassword(user.password, password);
    if (!verifyPassword) {
        res.sendStatus(HttpStatus.Unauthorized);
        return;
    }
    res.sendStatus(HttpStatus.NoContent);
}
