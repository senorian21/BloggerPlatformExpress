import { body } from "express-validator";

const emailValidation = body("email")
  .isString()
  .withMessage("email should be string")
  .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  .withMessage("URL does not match the required pattern");

export const registrationEmailResendingInputDtoValidation = [emailValidation];
