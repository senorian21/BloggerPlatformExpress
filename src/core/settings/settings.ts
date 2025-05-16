import { config } from "dotenv";

config();

export const appConfig = {
  DB_NAME: (process.env.DB_NAME as string) || "BloggerPlatform",
  DB_NAME_TEST: (process.env.DB_NAME_TEST as string) || "BloggerPlatformTest",
  AC_SECRET_ACCESS_TOKEN: process.env.AC_SECRET_ACCESS_TOKEN as string,
  AC_TIME_ACCESS_TOKEN: process.env.AC_TIME_ACCESS_TOKEN as string,
  AC_SECRET_REFRESH_TOKEN: process.env.SECRET_REFRESH_TOKEN as string,
  AC_TIME_REFRESH_TOKEN: process.env.TIME_REFRESH_TOKEN as string,
  PORT: process.env.PORT || 5003,
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017",
  YANDEX_EMAIL: process.env.YANDEX_EMAIL,
  YANDEX_PASSWORD: process.env.YANDEX_PASSWORD,
  TTL_SECONDS: process.env.TTL_SECONDS as string,
};
