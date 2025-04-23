import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { postsService } from "../../application/posts.service";
import {postsQueryRepository} from "../../repositories/posts.queryRepository";

export async function deletePostHandler(req: Request, res: Response) {
  const id = req.params.id;
  const post = await postsQueryRepository.findPostById(id);
  if (!post) {
    res.sendStatus(HttpStatus.NotFound);
    return;
  }
  postsService.deletePost(id);
  res.sendStatus(HttpStatus.NoContent);
}
