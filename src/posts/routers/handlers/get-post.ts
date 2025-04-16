import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { mapToPostViewModel } from "../../mappers/map-to-post-view-model.util";
import { postsService } from "../../application/posts.service";

export async function getPostHandler(req: Request, res: Response) {
  const id = req.params.id;
  const post = await postsService.findPostById(id);

  if (!post) {
    res.sendStatus(HttpStatus.NotFound);
    return;
  }

  const postViewModel = mapToPostViewModel(post);
  res.status(HttpStatus.Ok).send(postViewModel);
}
