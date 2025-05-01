import { Router } from "express";
import { commentsInputDtoValidation } from "../validation/comments.input-dto.validation-middlewares";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validtion-result.middleware";

export const commentsRouter = Router({});
