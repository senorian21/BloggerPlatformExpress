import express from "express";
import { authInputDtoValidation } from "../validation/auth.input-dto.validation-middlewares";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validtion-result.middleware";
import { loginizationHandler } from "./handlers/loginization";
import { aboutUserHandler } from "./handlers/about-user";
import { userInputDtoValidation } from "../../users/validation/users.input-dto.validation-middlewares";
import { registrationUserHandler } from "./handlers/registration-user";
import { accessTokenGuard } from "../middlewares/access.token.guard";
import { registrationConfirmationUserHandler } from "./handlers/registration-confirmation";
import { registrationConfirmationInputDtoValidation } from "../validation/registration-confirmation.input-dto.validation-middlewares";
import { registrationEmailResendingInputDtoValidation } from "../validation/registration-email-resending.input-dto.validation-middlewares";
import { registrationEmailResendingUserHandler } from "./handlers/registration-email-resending";

export const authRouter = express.Router({});

authRouter.post(
  "/login",
  authInputDtoValidation,
  inputValidationResultMiddleware,
  loginizationHandler,
);

authRouter.get("/me", accessTokenGuard, accessTokenGuard, aboutUserHandler);

authRouter.post(
  "/registration",
  userInputDtoValidation,
  inputValidationResultMiddleware,
  registrationUserHandler,
);

authRouter.post(
  "/registration-confirmation",
  registrationConfirmationInputDtoValidation,
  inputValidationResultMiddleware,
  registrationConfirmationUserHandler,
);

authRouter.post(
  "/registration-email-resending",
  registrationEmailResendingInputDtoValidation,
  inputValidationResultMiddleware,
  registrationEmailResendingUserHandler,
);
