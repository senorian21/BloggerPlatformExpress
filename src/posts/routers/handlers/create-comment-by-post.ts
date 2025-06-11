import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { commentsQueryRepositories } from "../../../comments/repositories/comments.queryRepository";
import { ResultStatus } from "../../../core/result/resultCode";
import { container } from "../../../composition-root";
import { CommentsService } from "../../../comments/application/comments.service";
import { PostsQueryRepository } from "../../repositories/posts.queryRepository";

const commentsService = container.get(CommentsService);

export async function createCommentHandler(req: Request, res: Response) {
  const postId = req.params.postId;
  const userId = req.user!.id;

  const createdCommentId = await commentsService.createComment(
    req.body,
    userId,
    postId,
  );
  if (createdCommentId.status === ResultStatus.NotFound) {
    res.sendStatus(HttpStatus.NotFound);
  }
  if (createdCommentId.status === ResultStatus.Unauthorized) {
    res.sendStatus(HttpStatus.Unauthorized);
  }

  const createdComments = await commentsQueryRepositories.findCommentsById(
    createdCommentId.data!,
  );

  res.status(HttpStatus.Created).send(createdComments);
}
