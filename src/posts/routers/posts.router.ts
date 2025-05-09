import { Router } from "express";
import { getPostsListHandler } from "./handlers/get-posts-list";
import { getPostHandler } from "./handlers/get-post";
import { deletePostHandler } from "./handlers/delete-post";
import { createPostHandler } from "./handlers/create-post";
import { updatePostHandler } from "./handlers/update-post";
import { postsInputDtoValidation } from "../validation/posts.input-dto.validation-middlewares";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validtion-result.middleware";
import { superAdminGuardMiddleware } from "../../auth/middlewares/super-admin.guard-middleware";
import { idValidationPosts } from "../validation/posts-params-id.validation-middleware";
import { paginationAndSortingValidation } from "../../core/middlewares/validation/query-pagination-sorting.validation-middleware";
import { commentsInputDtoValidation } from "../../comments/validation/comments.input-dto.validation-middlewares";
import { createCommentHandler } from "./handlers/create-comment-by-post";
import { getPostCommentsListHandler } from "./handlers/find-all-comments-by-posts";
import {accessTokenGuard} from "../../auth/middlewares/access.token.guard";


export const postsRouter = Router({});

postsRouter.get(
  "",
  paginationAndSortingValidation(),
  inputValidationResultMiddleware,
  getPostsListHandler,
);

postsRouter.get("/:id", inputValidationResultMiddleware, getPostHandler);

postsRouter.delete(
  "/:id",
  idValidationPosts,
  superAdminGuardMiddleware,
  inputValidationResultMiddleware,
  deletePostHandler,
);

postsRouter.post(
  "",
  superAdminGuardMiddleware,
  postsInputDtoValidation,
  inputValidationResultMiddleware,
  createPostHandler,
);

postsRouter.put(
  "/:id",
  idValidationPosts,
  superAdminGuardMiddleware,
  postsInputDtoValidation,
  inputValidationResultMiddleware,
  updatePostHandler,
);

postsRouter.post(
  "/:postId/comments",
    accessTokenGuard,
  commentsInputDtoValidation,
  inputValidationResultMiddleware,
  createCommentHandler,
);

postsRouter.get(
  "/:postId/comments",
  paginationAndSortingValidation(),
  inputValidationResultMiddleware,
  getPostCommentsListHandler,
);
