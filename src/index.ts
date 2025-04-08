import express from "express";
import { setupApp } from "./setup-app";
import { SETTINGS } from "./core/settings/settings";
import { runDb } from "./db/mongo.db";

const bootstrap = async () => {
  const app = express();
  setupApp(app);

  // порт приложения
  const PORT = SETTINGS.PORT;

  await runDb(SETTINGS.MONGO_URI);

  // запуск приложения
  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
  });
};

bootstrap();
