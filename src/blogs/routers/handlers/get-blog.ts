import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { container } from "../../../composition-root";
import { BlogsQueryRepositories } from "../../repositories/blogs.queryRepository";

const blogsQueryRepositories = container.get(BlogsQueryRepositories);

export async function getBlogHandler(req: Request, res: Response) {
  const id = req.params.blogId;

  const blog = await blogsQueryRepositories.findById(id);

  if (!blog) {
    res.sendStatus(HttpStatus.NotFound);
    return;
  }

  res.status(HttpStatus.Ok).send(blog);
}
