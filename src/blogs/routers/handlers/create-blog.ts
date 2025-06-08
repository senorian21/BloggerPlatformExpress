import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import {container} from "../../../composition-root";
import {BlogsService} from "../../application/blogs.service";
import {BlogsQueryRepositories} from "../../repositories/blogs.queryRepository";

const blogsService = container.get(BlogsService);
const blogsQueryRepositories = container.get(BlogsQueryRepositories);

export async function createBlogHandler(req: Request, res: Response) {
  const createdBlogId = await blogsService.createBlog(req.body);
  const newBlog = await blogsQueryRepositories.findById(createdBlogId);
  res.status(HttpStatus.Created).send(newBlog);
}
