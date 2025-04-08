export const SETTINGS = {
  PORT: process.env.PORT || 5003,
  MONGO_URI:
    process.env.MONGO_URI || "mongodb://localhost:27017/BloggerPlatform",
  DB_NAME: process.env.DB_NAME || "BloggerPlatform",
};
