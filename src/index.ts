import express from "express";
import { setupApp } from "./setup-app";

import { runDb } from "./db/mongo.db";
import {appConfig} from "./core/settings/settings";

const bootstrap = async () => {
  const app = express();
  setupApp(app);

  // порт приложения
  const PORT = appConfig.PORT;

  await runDb(appConfig.MONGO_URI);

  // запуск приложения
  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
  });
};

bootstrap();
