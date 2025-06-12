import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { commentInput } from "../../../comments/dto/comment.input-dto";
import { ResultStatus } from "../../../core/result/resultCode";
import { container } from "../../../composition-root";
import { CommentsService } from "../../application/comments.service";

const commentsService = container.get(CommentsService);

export async function likeCommentHandler(req: Request, res: Response) {
  const id = req.params.commentId;
  const userId = req.user!.id;
  const likeStatus = req.body.likeStatus;
  const likeComments = await commentsService.likeComments(
    id,
    userId,
    likeStatus,
  );
  if (likeComments.status != ResultStatus.Success) {
    res.sendStatus(HttpStatus.BadRequest);
    return;
  }
  res.sendStatus(HttpStatus.NoContent);
}
