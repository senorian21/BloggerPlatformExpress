import { Router } from "express";
import { commentsInputDtoValidation } from "../validation/comments.input-dto.validation-middlewares";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validtion-result.middleware";
import { updateCommentHandler} from "./handlers/update-comment";
import {deleteCommentHandler} from "./handlers/delete-comment";
import {getCommentByIdHandler} from "./handlers/get-comment-by-id";

export const commentsRouter = Router({});

commentsRouter.put(
  "/:commentId",
  commentsInputDtoValidation,
  inputValidationResultMiddleware,
    updateCommentHandler,
);

commentsRouter.delete(
    "/:commentId",
    deleteCommentHandler,
);
commentsRouter.get(
    "/:commentId",
    getCommentByIdHandler,
);