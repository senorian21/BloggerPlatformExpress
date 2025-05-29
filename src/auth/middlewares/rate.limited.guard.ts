import { Request, Response, NextFunction } from "express";
import {rateCollection} from "../../db/mongo.db";
import {HttpStatus} from "../../core/types/http-statuses";

const rateLimiter = async (req: Request, res: Response, next: NextFunction) => {
    const ip: string =
        req.socket.remoteAddress ||
        (Array.isArray(req.headers["x-forwarded-for"])
            ? req.headers["x-forwarded-for"][0]
            : req.headers["x-forwarded-for"]) ||
        "unknown";
    const url = req.originalUrl;
    const currentTime = new Date();
    const tenSecondsAgo = new Date(currentTime.getTime() - 10000);
    if (!ip) {
         res.status(400).json({ error: "IP address is missing" });
        return
    }

    const count = await rateCollection.countDocuments({
        IP: ip,
        URL: url,
        date: { $gte: tenSecondsAgo.toISOString() },
    });

    if (count > 5) {
         res.sendStatus(HttpStatus.TooManyRequests);
        return
    }

    await rateCollection.insertOne({ IP: ip, URL: url, date: currentTime.toISOString() });


    next();
};

export default rateLimiter;
