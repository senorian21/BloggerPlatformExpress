import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { mapToBlogViewModel } from "../../mappers/map-to-blog-view-model.util";
import { blogsService } from "../../application/blogs.service";

export async function getBlogHandler(req: Request, res: Response) {
  const id = req.params.blogId;

  const blog = await blogsService.findById(id);

  if (!blog) {
    res.sendStatus(HttpStatus.NotFound);
    return;
  }

  const blogViewModel = mapToBlogViewModel(blog);
  res.status(HttpStatus.Ok).send(blogViewModel);
}
