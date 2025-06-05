import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { postsQueryRepository, postsService } from "../../../composition-root";

export async function createPostHandler(req: Request, res: Response) {
  const createdPostsId = await postsService.createPost(req.body);
  if (!createdPostsId) {
    res.sendStatus(HttpStatus.NotFound);
    return;
  }
  const newPost = await postsQueryRepository.findPostById(createdPostsId);
  res.status(HttpStatus.Created).send(newPost);
}
