import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { mapToPostViewModel } from "../../mappers/map-to-post-view-model.util";
import { postsService } from "../../application/posts.service";

export async function createPostHandler(req: Request, res: Response) {
  const createdPosts = await postsService.createPost(req.body);
  if (createdPosts) {
    const postViewModel = mapToPostViewModel(createdPosts);
    res.status(HttpStatus.Created).send(postViewModel);
  }
}
