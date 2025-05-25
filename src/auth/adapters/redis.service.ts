import Redis from "ioredis";
import { appConfig } from "../../core/settings/settings";
import { createHash } from "crypto";

const redisClient = new Redis({
  host: "localhost",
  port: 6379,
});

export const redisService = {
  async blacklistRefreshToken(refreshToken: string, userId: string) {
    const tokenHash = refreshToken;
    await redisClient.setex(`rtk:${tokenHash}`, +appConfig.TTL_SECONDS, userId);
  },

  async isTokenBlacklisted(refreshToken: string): Promise<boolean> {
    const tokenHash = refreshToken;
    const exists = await redisClient.exists(`rtk:${refreshToken}`);
    return exists === 1;
  },
};

// const keys = await redisClient.keys('rtk:*');
// for (const key of keys) {
//   const value = await redisClient.get(key);
//   console.log({ key, value });
// }

// await redisClient.flushdb();
// console.log('Redis: текущая БД очищена');

// const redisClient = new Redis('redis://default:ldpiHTucBV2I8Iy6ogsznue8KqBzradC@redis-12870.c258.us-east-1-4.ec2.redns.redis-cloud.com:12870');
