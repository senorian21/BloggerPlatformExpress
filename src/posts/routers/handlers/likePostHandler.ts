import { Request, Response } from "express";
import { ResultStatus } from "../../../core/result/resultCode";
import { HttpStatus } from "../../../core/types/http-statuses";
import { container } from "../../../composition-root";
import { PostsService } from "../../application/posts.service";

const postsService = container.get(PostsService);

export async function likePostHandler(req: Request, res: Response) {
  const postId = req.params.postId;
  const userId = req.user?.id;
  if (!userId) {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }
  const likeStatus = req.body.likeStatus;
  const likePost = await postsService.likePost(postId, userId, likeStatus);
  if (likePost.status != ResultStatus.Success) {
    res.sendStatus(HttpStatus.NotFound);
    return;
  }
  res.sendStatus(HttpStatus.NoContent);
}
