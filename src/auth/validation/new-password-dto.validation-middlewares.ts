import { body } from "express-validator";

const passwordValidation = body("newPassword")
  .isString()
  .withMessage("password should be string")
  .trim()
  .isLength({ min: 6, max: 20 })
  .withMessage("password is not correct");

export const newPasswordDtoValidation = [passwordValidation];
