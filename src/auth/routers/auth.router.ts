import express from "express";
import { authInputDtoValidation } from "../validation/auth.input-dto.validation-middlewares";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validtion-result.middleware";
import { loginizationHandler } from "./handlers/loginization";
import {jwtTokenGuard} from "../middlewares/access.token.guard";
import {aboutUserHandler} from "./handlers/about-user";

export const authRouter = express.Router({});

authRouter.post(
  "/login",
  authInputDtoValidation,
  inputValidationResultMiddleware,
  loginizationHandler,
);

authRouter.get(
    "/me",
    aboutUserHandler,
)