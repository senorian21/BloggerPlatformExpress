import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { blogsRepositories } from "../../repositories/blogs.repository";

export async function deleteBlogHandler(req: Request, res: Response) {
  const id = req.params.id;
  const blog = await blogsRepositories.findById(id);
  if (!blog) {
    res.sendStatus(HttpStatus.NotFound)
  }
  blogsRepositories.deleteBlog(id);
  res.sendStatus(HttpStatus.NoContent);
}
