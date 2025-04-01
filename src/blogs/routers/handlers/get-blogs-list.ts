import { Request, Response } from "express";
import { db } from "../../../db/in-memory.db";
import { HttpStatus } from "../../../core/types/http-statuses";
import { blogsRepositories } from "../../repositories/blogs.repository";

export function getBlogsListHandler(req: Request, res: Response) {
  const blog = blogsRepositories.findAllBlogs();
  res.status(HttpStatus.Ok).send(blog);
}
