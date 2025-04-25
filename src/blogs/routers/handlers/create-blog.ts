import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { blogsService } from "../../application/blogs.service";
import { blogsQueryRepositories } from "../../repositories/blogs.queryRepository";

export async function createBlogHandler(req: Request, res: Response) {
  const createdBlogId = await blogsService.createBlog(req.body);
  const newBlog = await blogsQueryRepositories.findById(createdBlogId);
  res.status(HttpStatus.Created).send(newBlog);
}
