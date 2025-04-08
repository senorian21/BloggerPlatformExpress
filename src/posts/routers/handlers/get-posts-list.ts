import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { postsRepository } from "../../repositories/posts.repository";
import { mapToPostViewModel } from "../../mappers/map-to-post-view-model.util";

export async function getPostsListHandler(req: Request, res: Response) {
  const post = await postsRepository.findAllPosts();
  const postViewModel = post.map(mapToPostViewModel);
  res.status(HttpStatus.Ok).send(postViewModel);
}
