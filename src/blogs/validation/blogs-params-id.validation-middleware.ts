import { param } from "express-validator";
import { db } from "../../db/in-memory.db";

export const idValidationBlogs = param("id")
  .exists()
  .withMessage("ID is required")
  .isString()
  .withMessage("ID must be a string")
  .isLength({ min: 1 })
  .withMessage("ID must not be empty")
  .isNumeric()
  .withMessage("ID must be a numeric string")
  .custom(async (value: string) => {
    const blogIndex = db.blogs.findIndex((b) => b.id === value); // Проверка индекса
    if (blogIndex === -1) {
      throw new Error("Blog ID not found");
    }
    return true;
  });
