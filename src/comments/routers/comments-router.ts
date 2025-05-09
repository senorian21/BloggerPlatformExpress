import { Router } from "express";
import { commentsInputDtoValidation } from "../validation/comments.input-dto.validation-middlewares";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validtion-result.middleware";
import { updateCommentHandler } from "./handlers/update-comment";
import { deleteCommentHandler } from "./handlers/delete-comment";
import { getCommentByIdHandler } from "./handlers/get-comment-by-id";
import { accessTokenGuard } from "../../auth/middlewares/access.token.guard";

export const commentsRouter = Router({});

commentsRouter.put(
  "/:commentId",
  accessTokenGuard,
  commentsInputDtoValidation,
  inputValidationResultMiddleware,
  updateCommentHandler,
);

commentsRouter.delete("/:commentId", accessTokenGuard, deleteCommentHandler);
commentsRouter.get("/:commentId", getCommentByIdHandler);
