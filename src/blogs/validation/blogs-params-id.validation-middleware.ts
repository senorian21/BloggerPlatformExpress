import { param } from "express-validator";
import { db } from "../../db/in-memory.db";

export const idValidationBlogs = param("id")
  .exists()
  .withMessage("ID is required")
  .isString()
  .withMessage("ID must be a string")
  .isMongoId()
  .withMessage("Incorrect format of ObjectId");
