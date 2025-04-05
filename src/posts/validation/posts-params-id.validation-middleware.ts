import { param } from "express-validator";
import { db } from "../../db/in-memory.db";

export const idValidationPosts = param("id")
  .exists()
  .withMessage("ID is required")
  .isString()
  .withMessage("ID must be a string")
  .isLength({ min: 1 })
  .withMessage("ID must not be empty")
  .isNumeric()
  .withMessage("ID must be a numeric string")
  .custom(async (value: string) => {
    const postsIndex = db.posts.findIndex((b) => b.id === value); // Проверка индекса
    if (postsIndex === -1) {
      throw new Error("Blog ID not found");
    }
    return true;
  });
