import { Router, Request, Response } from "express";
import { getBlogsListHandler } from "./handlers/get-blogs-list";
import { getBlogHandler } from "./handlers/get-blog";
import { deleteBlogHandler } from "./handlers/delete-blog";
import { postBlogHandler } from "./handlers/create-blog";
import { putBlogHandler } from "./handlers/update-blog";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validtion-result.middleware";
import { blogsInputDtoValidation } from "../validation/blogs.input-dto.validation-middlewares";
import { superAdminGuardMiddleware } from "../../auth/middlewares/super-admin.guard-middleware";
import {idValidationBlogs} from "../validation/blogs-params-id.validation-middleware";

export const blogsRouter = Router({});

blogsRouter.get("", getBlogsListHandler);

blogsRouter.get(
  "/:id",
    idValidationBlogs,
  inputValidationResultMiddleware,
  getBlogHandler,
);

blogsRouter.delete(
  "/:id",
    idValidationBlogs,
  superAdminGuardMiddleware,
  inputValidationResultMiddleware,
  deleteBlogHandler,
);

blogsRouter.post(
  "",
  superAdminGuardMiddleware,
  blogsInputDtoValidation,
  inputValidationResultMiddleware,
  postBlogHandler,
);

blogsRouter.put(
  "/:id", idValidationBlogs,
  superAdminGuardMiddleware,
  blogsInputDtoValidation,
  inputValidationResultMiddleware,
  putBlogHandler,
);
