import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { postsQueryRepository, postsService } from "../../../composition-root";

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
