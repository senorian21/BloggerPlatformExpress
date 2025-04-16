import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { mapToPostViewModel } from "../../mappers/map-to-post-view-model.util";
import { postsService } from "../../application/posts.service";

export async function getPostsListHandler(req: Request, res: Response) {
  const post = await postsService.findAllPosts();
  const postViewModel = post.map(mapToPostViewModel);
  res.status(HttpStatus.Ok).send(postViewModel);
}
