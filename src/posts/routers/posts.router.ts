import { Router, Request, Response } from "express";
import { db } from "../../db/in-memory.db";
import { HttpStatus } from "../../core/types/http-statuses";
import { getPostsListHandler } from "./handlers/get-posts-list";
import { getPostHandler } from "./handlers/get-post";
import { deletePostHandler } from "./handlers/delete-post";
import { createPostHandler } from "./handlers/create-post";
import { updatePostHandler } from "./handlers/update-post";

export const postsRouter = Router({});

postsRouter.get("", getPostsListHandler);

postsRouter.get("/:id", getPostHandler);

postsRouter.delete("/:id", deletePostHandler);

postsRouter.post("", createPostHandler);

postsRouter.put("/:id", updatePostHandler);
