import { Router, Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { postsRepository } from "../../repositories/posts.repository";

export async function deletePostHandler(req: Request, res: Response) {
  const id = req.params.id;
  const post = await postsRepository.findPostById(id)
  if (!post) {
    res.sendStatus(HttpStatus.NotFound)
  }
  postsRepository.deletePost(id);
  res.sendStatus(HttpStatus.NoContent);
}
