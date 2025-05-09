import { body } from "express-validator";

const codeValidation = body("code")
  .isString()
  .withMessage("code should be string")
  .trim()
  .isLength({ min: 1 })
  .withMessage("Length of code is not correct");

export const registrationConfirmationInputDtoValidation = [codeValidation];
