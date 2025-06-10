import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { RateModel } from "../domain/rate.entity";

const MAX_REQUESTS = 5;
const TIME_WINDOW_MS = 10 * 1000; // 10 секунд

const rateLimiter = async (req: Request, res: Response, next: NextFunction) => {
  const ip =
    req.socket.remoteAddress ||
    (Array.isArray(req.headers["x-forwarded-for"])
      ? req.headers["x-forwarded-for"][0]
      : req.headers["x-forwarded-for"]) ||
    "unknown";
  const url = req.originalUrl;
  const now = new Date();
  const timeAgo = new Date(now.getTime() - TIME_WINDOW_MS);

  const count = await RateModel.countDocuments({
    IP: ip,
    URL: url,
    date: { $gte: timeAgo.toISOString() },
  });

  if (count >= MAX_REQUESTS) {
    res.sendStatus(HttpStatus.TooManyRequests);
    return;
  }

  await RateModel.create({ IP: ip, URL: url, date: now.toISOString() });

  next();
};

export default rateLimiter;
