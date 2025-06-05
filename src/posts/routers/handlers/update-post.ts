import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { Post } from "../../../posts/types/post";
import { postsService } from "../../../composition-root";

export async function updatePostHandler(req: Request, res: Response) {
  const id = req.params.id;

  const postInput: Post = {
    ...req.body,
  };

  const postUpdated = await postsService.updatePost(id, postInput);
  if (!postUpdated) {
    res.sendStatus(HttpStatus.NotFound);
  }
  res.sendStatus(HttpStatus.NoContent);
}
