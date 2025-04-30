import { config } from "dotenv";




config();

export const appConfig = {
  DB_NAME: process.env.DB_NAME as string || "BloggerPlatform",
  AC_SECRET: process.env.AC_SECRET as string,
  AC_TIME: process.env.AC_TIME as string,
  PORT: process.env.PORT || 5003,
  MONGO_URI:
      process.env.MONGO_URI || "mongodb://localhost:27017/BloggerPlatform",
};
