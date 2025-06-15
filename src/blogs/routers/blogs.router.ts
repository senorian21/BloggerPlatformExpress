import { Router } from "express";
import { getBlogsListHandler } from "./handlers/get-blogs-list";
import { getBlogHandler } from "./handlers/get-blog";
import { deleteBlogHandler } from "./handlers/delete-blog";
import { createBlogHandler } from "./handlers/create-blog";
import { putBlogHandler } from "./handlers/update-blog";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validtion-result.middleware";
import { blogsInputDtoValidation } from "../validation/blogs.input-dto.validation-middlewares";
import { superAdminGuardMiddleware } from "../../auth/middlewares/super-admin.guard-middleware";
import { idValidationBlogs } from "../validation/blogs-params-id.validation-middleware";
import { getBlogPostsListHandler } from "./handlers/get-blog-post-list";
import { postsBlogInputDtoValidation } from "../../posts/validation/posts.input-dto.validation-middlewares";

import { createPostByBlogHandler } from "./handlers/create-post-by-blog";
import { paginationAndSortingValidation } from "../../core/middlewares/validation/query-pagination-sorting.validation-middleware";
import { authorizationVerification } from "../../like/middlewares/authorizationVerification";

export const blogsRouter = Router({});

blogsRouter.get(
  "",
  paginationAndSortingValidation(),
  inputValidationResultMiddleware,
  getBlogsListHandler,
);

blogsRouter.get("/:blogId", getBlogHandler);

blogsRouter.delete("/:blogId", superAdminGuardMiddleware, deleteBlogHandler);

blogsRouter.post(
  "",
  superAdminGuardMiddleware,
  blogsInputDtoValidation,
  inputValidationResultMiddleware,
  createBlogHandler,
);

blogsRouter.put(
  "/:blogId",
  superAdminGuardMiddleware,
  blogsInputDtoValidation,
  inputValidationResultMiddleware,
  putBlogHandler,
);

blogsRouter.get(
  "/:blogId/posts",
  paginationAndSortingValidation(),
  inputValidationResultMiddleware,
  authorizationVerification,
  getBlogPostsListHandler,
);

blogsRouter.post(
  "/:blogId/posts",
  superAdminGuardMiddleware,
  idValidationBlogs,
  postsBlogInputDtoValidation,
  inputValidationResultMiddleware,
  createPostByBlogHandler,
);
