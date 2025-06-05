import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import {
  blogsQueryRepositories,
  blogsService,
} from "../../../composition-root";

export async function createBlogHandler(req: Request, res: Response) {
  const createdBlogId = await blogsService.createBlog(req.body);
  const newBlog = await blogsQueryRepositories.findById(createdBlogId);
  res.status(HttpStatus.Created).send(newBlog);
}
