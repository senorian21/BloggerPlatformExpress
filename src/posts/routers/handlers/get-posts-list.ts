import { Request, Response } from "express";
import { db } from "../../../db/in-memory.db";
import { HttpStatus } from "../../../core/types/http-statuses";
import {postsRepository} from "../../repositories/posts.repository";

export function getPostsListHandler(req: Request, res: Response) {
  const posts = postsRepository.findAllPosts()
  res.status(HttpStatus.Ok).send(posts);
}
