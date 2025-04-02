import { Router, Request, Response } from "express";
import { db } from "../../db/in-memory.db";
import { HttpStatus } from "../../core/types/http-statuses";
import { getBlogsListHandler } from "./handlers/get-blogs-list";
import { getBlogHandler } from "./handlers/get-blog";
import { deleteBlogHandler } from "./handlers/delete-blog";
import { postBlogHandler } from "./handlers/create-blog";
import { putBlogHandler } from "./handlers/update-blog";
import { idValidation } from "../../core/middlewares/validation/params-id.validation-middleware";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validtion-result.middleware";
import {blogsInputDtoValidation} from "../validation/blogs.input-dto.validation-middlewares"
import {superAdminGuardMiddleware} from "../../auth/middlewares/super-admin.guard-middleware";

export const blogsRouter = Router({});

blogsRouter.get("", getBlogsListHandler);

blogsRouter.get("/:id", idValidation, inputValidationResultMiddleware, getBlogHandler);

blogsRouter.delete("/:id", idValidation, superAdminGuardMiddleware,  inputValidationResultMiddleware, deleteBlogHandler);

blogsRouter.post("", superAdminGuardMiddleware, blogsInputDtoValidation, inputValidationResultMiddleware, postBlogHandler);

blogsRouter.put("/:id", idValidation, superAdminGuardMiddleware,  blogsInputDtoValidation, inputValidationResultMiddleware, putBlogHandler);
