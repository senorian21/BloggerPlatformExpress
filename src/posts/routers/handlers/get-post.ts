import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { mapToPostViewModel } from "../../mappers/map-to-post-view-model.util";
import { postsService } from "../../application/posts.service";
import {postsQueryRepository} from "../../repositories/posts.queryRepository";

export async function getPostHandler(req: Request, res: Response) {
  const id = req.params.id;
  const post = await postsQueryRepository.findPostById(id);

  if (!post) {
    res.sendStatus(HttpStatus.NotFound);
    return;
  }

  const postViewModel = mapToPostViewModel(post);
  res.status(HttpStatus.Ok).send(postViewModel);
}
