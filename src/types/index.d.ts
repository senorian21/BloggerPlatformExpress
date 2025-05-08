// src/types/index.d.ts

declare global {
  namespace Express {
    interface Request {
      userId?: string; // Добавляем необязательное свойство userId
      user?: { id: string }; // Добавляем необязательное свойство user
    }
  }
}

export {}; // Эта строка необходима, чтобы TypeScript воспринимал файл как модуль
