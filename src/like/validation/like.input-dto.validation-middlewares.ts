import { body } from "express-validator";
import { likeStatus } from "../domain/like.entity";

const likeValidation = body("likeStatus")
  .exists()
  .withMessage("likeStatus is required")
  .isIn(Object.values(likeStatus))
  .withMessage("Invalid likeStatus. Must be one of: None, Like, Dislike");

export const likeInputDtoValidation = [likeValidation];
