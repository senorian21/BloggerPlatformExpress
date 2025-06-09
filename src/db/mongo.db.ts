import { appConfig } from "../core/settings/settings";
import mongoose from 'mongoose';

let isTestMode = false;

export function setIsTestMode(mode: boolean): void {
  isTestMode = mode;
}

export async function runDb(url: string): Promise<void> {
  const dbName = isTestMode ? appConfig.DB_NAME_TEST : appConfig.DB_NAME;
  const fullUrl = `${url}/${dbName}`;

  try {
    await mongoose.connect(fullUrl);

    if (mongoose.connection.readyState === 1) {
      console.log(`Connected to database: ${dbName}`);
    } else {
      throw new Error("Failed to establish a connection with the database");
    }

    console.log(`Connected to database: ${dbName}`);
  } catch (err) {
    await mongoose.disconnect();
    console.error("Failed to connect to the database:", err);
  }
}