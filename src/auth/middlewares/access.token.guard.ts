import { NextFunction, Request, Response } from 'express';
import {jwtService} from "../adapters/jwt.service";


export const jwtTokenGuard = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const header = req.headers.authorization;

    // Проверка наличия заголовка Authorization
    if (!header) {
        res.sendStatus(401)
        return
    }

    // Разбор заголовка Authorization
    const authHeaderParts = header.split(" ");
    if (authHeaderParts.length !== 2 || authHeaderParts[0] !== "Bearer") {
        res.sendStatus(401)
        return
    }

    const [authType, token] = authHeaderParts;

    // Проверка токена (пример)
    const payload = await jwtService.verifyToken(token);
    if (!payload) {
        res.sendStatus(401)
        return
    }


    next();
};
