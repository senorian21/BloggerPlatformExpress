import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";

import { mapToBlogViewModel } from "../../mappers/map-to-blog-view-model.util";
import { blogsService } from "../../application/blogs.service";

export async function getBlogsListHandler(req: Request, res: Response) {
  const blog = await blogsService.findMany();
  const blogsViewModel = blog.map(mapToBlogViewModel);
  res.status(HttpStatus.Ok).send(blogsViewModel);
}
