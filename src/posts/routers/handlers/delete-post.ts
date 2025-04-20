import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { postsService } from "../../application/posts.service";

export async function deletePostHandler(req: Request, res: Response) {
  const id = req.params.id;
  const post = await postsService.findPostById(id);
  if (!post) {
    res.sendStatus(HttpStatus.NotFound);
    return;
  }
  postsService.deletePost(id);
  res.sendStatus(HttpStatus.NoContent);
}
