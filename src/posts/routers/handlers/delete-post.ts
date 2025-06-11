import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { container } from "../../../composition-root";
import { PostsService } from "../../application/posts.service";

const postsService = container.get(PostsService);

export async function deletePostHandler(req: Request, res: Response) {
  const id = req.params.id;

  const deletedPost = await postsService.deletePost(id);
  if (!deletedPost) {
    res.sendStatus(HttpStatus.NotFound);
    return;
  }
  res.sendStatus(HttpStatus.NoContent);
}
