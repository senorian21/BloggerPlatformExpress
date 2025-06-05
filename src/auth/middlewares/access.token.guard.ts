import { NextFunction, Request, Response } from "express";
import { IdType } from "../../core/types/id";
import { jwtService } from "../../composition-root";

export const accessTokenGuard = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  // Проверка наличия заголовка Authorization
  if (!req.headers.authorization) {
    res.sendStatus(401);
    return;
  }

  // Разбор заголовка Authorization
  const authHeaderParts = req.headers.authorization.split(" ");
  if (authHeaderParts.length !== 2 || authHeaderParts[0] !== "Bearer") {
    res.sendStatus(401);
    return;
  }

  const [, token] = authHeaderParts;

  // Проверка токена
  const payload = await jwtService.verifyToken(token);
  if (!payload || !payload.userId) {
    res.sendStatus(401);
    return;
  }

  // Добавляем данные пользователя в объект запроса
  req.user = { id: payload.userId } as IdType;

  // Передаем управление следующему middleware
  next();
};
