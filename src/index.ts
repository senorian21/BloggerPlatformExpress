import express from "express";
import { setupApp } from "./setup-app";

import { runDb } from "./db/mongo.db";
import {appConfig, SETTINGS} from "./core/settings/settings";

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
