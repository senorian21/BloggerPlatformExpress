import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { commentsService } from "../../../comments/application/comments.service";
import {commentsQueryRepositories} from "../../../comments/repositories/comments.queryRepository";
import {ResultStatus} from "../../../core/result/resultCode";
import {postsQueryRepository} from "../../repositories/posts.queryRepository";

export async function createCommentHandler(req: Request, res: Response) {

  const postId = req.params.postId;
  const header = req.headers.authorization;
  const post = await postsQueryRepository.findPostById(postId);
  if (!post) {
    res.sendStatus(HttpStatus.NotFound)
  }

  const createdCommentId = await commentsService.createComment(
    req.body,
    header,
    postId,
  );
  if (createdCommentId.status !== ResultStatus.Success) {
    res.sendStatus(HttpStatus.Unauthorized);
  }

  const createdComments = await commentsQueryRepositories.findCommentsById(createdCommentId.data!);

  res.status(HttpStatus.Created).send(createdComments);
}
