import { Request, Response } from "express";
import { db } from "../../../db/in-memory.db";
import { HttpStatus } from "../../../core/types/http-statuses";
import { blogsRepositories } from "../../repositories/blogs.repository";
import { mapToBlogViewModel } from "../../mappers/map-to-blog-view-model.util";

export async function getBlogsListHandler(req: Request, res: Response) {
  const blog = await blogsRepositories.findAllBlogs();
  const blogsViewModel = blog.map(mapToBlogViewModel);
  res.status(HttpStatus.Ok).send(blogsViewModel);
}
