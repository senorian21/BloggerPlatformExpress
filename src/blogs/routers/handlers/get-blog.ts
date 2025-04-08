import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { blogsRepositories } from "../../repositories/blogs.repository";
import { mapToBlogViewModel } from "../../mappers/map-to-blog-view-model.util";

export async function getBlogHandler(req: Request, res: Response) {
  const id = req.params.id;

  const blog = await blogsRepositories.findById(id);

  if (!blog) {
    res.sendStatus(HttpStatus.NotFound);
    return;
  }

  const blogViewModel = mapToBlogViewModel(blog);
  res.status(HttpStatus.Ok).send(blogViewModel);
}
