import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { mapToBlogViewModel } from "../../mappers/map-to-blog-view-model.util";
import { blogsService } from "../../application/blogs.service";

export async function createBlogHandler(req: Request, res: Response) {
  const createdBlog = await blogsService.createBlog(req.body);

  const blogViewModel = mapToBlogViewModel(createdBlog);
  res.status(HttpStatus.Created).send(blogViewModel);
}
