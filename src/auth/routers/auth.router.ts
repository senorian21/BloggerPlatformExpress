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
import { refreshTokenGuard } from "../middlewares/refresh.token.guard";
import { refreshTokenHandler } from "./handlers/refresh-token";
import { logoutHandler } from "./handlers/logout";
import rateLimiter from "../middlewares/rate.limited.guard";
import { passwordRecoveryHandler } from "./handlers/password-recovery";

export const authRouter = express.Router({});

authRouter.post(
  "/login",
  rateLimiter,
  authInputDtoValidation,
  inputValidationResultMiddleware,
  loginizationHandler,
);

authRouter.get("/me", accessTokenGuard, aboutUserHandler);

authRouter.post(
  "/registration",
  rateLimiter,
  userInputDtoValidation,
  inputValidationResultMiddleware,
  registrationUserHandler,
);

authRouter.post(
  "/registration-confirmation",
  rateLimiter,
  registrationConfirmationInputDtoValidation,
  inputValidationResultMiddleware,
  registrationConfirmationUserHandler,
);

authRouter.post(
  "/registration-email-resending",
  rateLimiter,
  registrationEmailResendingInputDtoValidation,
  inputValidationResultMiddleware,
  registrationEmailResendingUserHandler,
);

authRouter.post("/refresh-token", refreshTokenGuard, refreshTokenHandler);

authRouter.post(
  "/password-recovery",
  rateLimiter,
  registrationEmailResendingInputDtoValidation,
  inputValidationResultMiddleware,
  passwordRecoveryHandler,
);

authRouter.post("/logout", refreshTokenGuard, logoutHandler);
