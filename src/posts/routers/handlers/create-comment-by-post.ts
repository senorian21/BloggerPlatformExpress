import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { ResultStatus } from "../../../core/result/resultCode";
import { container } from "../../../composition-root";
import { CommentsService } from "../../../comments/application/comments.service";
import { CommentsQueryRepositories } from "../../../comments/repositories/comments.queryRepository";

const commentsService = container.get(CommentsService);
const commentsQueryRepositories = container.get(CommentsQueryRepositories);

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

  const createdComments = await commentsQueryRepositories.findCommentsByIdLike(
    createdCommentId.data!,
  );

  res.status(HttpStatus.Created).send(createdComments);
}
