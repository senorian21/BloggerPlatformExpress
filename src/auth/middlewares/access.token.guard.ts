import { NextFunction, Request, Response } from 'express';
import {jwtService} from "../adapters/jwt.service";
import {IdType} from "../../core/types/id";

export const jwtTokenGuard = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const header = req.headers.authorization;


    if (!header) {
        res.sendStatus(401)
        return
    }


    const authHeaderParts = header.split(" ");
    if (authHeaderParts.length !== 2 || authHeaderParts[0] !== "Bearer") {
        res.sendStatus(401)
        return
    }

    const [authType, token] = authHeaderParts;


    const payload = await jwtService.verifyToken(token);
    if (!payload) {
        res.sendStatus(401)
        return
    }


    next();
};



// export const accessTokenGuard = async (req: Request, res: Response, next: NextFunction) => {
//     if (!req.headers.authorization) return res.sendStatus(401);
//
//     const [authType, token] = req.headers.authorization.split(' ')[1];
//
//     if (authType !== 'Bearer') return res.sendStatus(401);
//
//     const payload = await jwtService.verifyToken(token);
//     if (payload) {
//         const { userId } = payload;
//
//         req.user = { id: userId } as IdType;
//         next();
//
//         return;
//     }
//     res.sendStatus(401);
//
//     return;
// };

