import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { userQueryInput } from "../../users/types/user-query.input";

// process - это глобальный объект в Node.js, который предоставляет информацию о текущем процессе Node.js
// env — это объект, который хранит все переменные окружения текущего процесса. Переменные окружения — это значения,
// которые могут быть установлены на уровне операционной системы или приложения и которые могут использоваться для
// настройки поведения программного обеспечения (например, пароли, ключи API, пути к файлам и т. д.)
export const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "qwerty";

export const superAdminGuardMiddleware = (
  req: Request<{}, {}, {}, {}>,
  res: Response,
  next: NextFunction,
) => {
  const auth = req.headers["authorization"] as string; // 'Basic xxxx'

  if (!auth) {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }

  const [authType, token] = auth.split(" ");

  if (authType !== "Basic") {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }

  const credentials = Buffer.from(token, "base64").toString("utf-8"); //dbcadkcnasdk

  const [username, password] = credentials.split(":"); //admin:qwerty

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }

  next(); // Успешная авторизация, продолжаем
};
