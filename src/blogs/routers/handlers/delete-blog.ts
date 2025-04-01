import { Request, Response } from "express";
import { db } from "../../../db/in-memory.db";
import { HttpStatus } from "../../../core/types/http-statuses";
import {blogsRepositories} from "../../repositories/blogs.repository";

export function deleteBlogHandler(req: Request, res: Response) {
  const id = req.params.id;
  const blog = blogsRepositories.findById(id)
  blogsRepositories.deleteBlog(id)
  res.sendStatus(HttpStatus.NoContent);
}
