import { body } from "express-validator";

const loginValidation = body("login")
  .isString()
  .withMessage("login should be string")
  .trim()
  .isLength({ min: 3, max: 10 })
  .withMessage("Length of name is not correct")
  .matches(/^[a-zA-Z0-9_-]*$/)
  .withMessage("login does not match the required pattern");

const passwordValidation = body("password")
  .isString()
  .withMessage("password should be string")
  .trim()
  .isLength({ min: 6, max: 20 })
  .withMessage("password is not correct");

const emailValidation = body("email")
  .isString()
  .withMessage("email should be string")
  .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  .withMessage("URL does not match the required pattern");

export const blogsInputDtoValidation = [
  loginValidation,
  passwordValidation,
  emailValidation,
];
