import { Request, Response } from "express";
import { db } from "../../../db/in-memory.db";
import { HttpStatus } from "../../../core/types/http-statuses";
import { blogsRepositories } from "../../repositories/blogs.repository";

export function putBlogHandler(req: Request, res: Response) {
  const id = req.params.id;
  blogsRepositories.updateBlog(id, req.body);
  res.sendStatus(HttpStatus.NoContent);
}
