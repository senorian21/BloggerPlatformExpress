import { param } from "express-validator";
import { postsRepository } from "../repositories/posts.repository";

export const idValidationPosts = param("id")
  .exists()
  .withMessage("ID is required")
  .isString()
  .withMessage("ID must be a string")
  .isLength({ min: 1 })
  .withMessage("ID must not be empty")
  .isMongoId()
  .withMessage("Incorrect format of ObjectId")

