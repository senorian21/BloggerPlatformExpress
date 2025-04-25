import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { postsQueryRepository } from "../../repositories/posts.queryRepository";

export async function getPostHandler(req: Request, res: Response) {
  const id = req.params.id;
  const post = await postsQueryRepository.findPostById(id);

  if (!post) {
    res.sendStatus(HttpStatus.NotFound);
    return;
  }

  res.status(HttpStatus.Ok).send(post);
}
