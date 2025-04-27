import { body } from "express-validator";

const loginOrEmailValidation = body("loginOrEmail")
  .isString()
  .withMessage("login Or Email should be string")
  .trim()
  .isLength({ min: 3, max: 30 })
  .withMessage("Length of login Or Email is not correct");

const passwordValidation = body("password")
  .isString()
  .withMessage("password should be string")
  .trim()
  .isLength({ min: 6, max: 20 })
  .withMessage("password is not correct");

export const authInputDtoValidation = [
  loginOrEmailValidation,
  passwordValidation,
];
