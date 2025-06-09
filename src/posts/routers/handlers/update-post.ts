import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { container } from "../../../composition-root";
import { PostsService } from "../../application/posts.service";
import { Post } from "../../domain/post.entity";

const postsService = container.get(PostsService);

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
