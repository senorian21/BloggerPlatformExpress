import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { blogsRepositories } from "../../repositories/blogs.repository";
import { Blog } from "../../types/blog";

export async function putBlogHandler(req: Request, res: Response) {
  const id = req.params.id;
  const blog = await blogsRepositories.findById(id);

  if (!blog) {
    res.sendStatus(HttpStatus.NotFound);
    return;
  }

  const dto: Blog = {
    ...blog,
    name: req.body.name,
    description: req.body.description,
    websiteUrl: req.body.websiteUrl,
    createdAt: blog.createdAt,
    isMembership: blog.isMembership,
  };

  await blogsRepositories.updateBlog(id, dto);
  res.sendStatus(HttpStatus.NoContent);
}
