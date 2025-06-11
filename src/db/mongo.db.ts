import { appConfig } from "../core/settings/settings";
import mongoose from "mongoose";

export async function runDb(url: string): Promise<void> {
  const dbName = appConfig.DB_NAME;
  const fullUrl = `${url}/${dbName}`;

  try {
    await mongoose.connect(fullUrl);

    if (mongoose.connection.readyState === 1) {
      console.log(`Connected to database: ${dbName}`);
    } else {
      throw new Error("Failed to establish a connection with the database");
    }
  } catch (err) {
    await mongoose.disconnect();
    console.error("Failed to connect to the database:", err);
  }
}
