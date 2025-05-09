import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { commentInput } from "../../../comments/dto/comment.input-dto";
import { commentsService } from "../../application/comments.service";
import { ResultStatus } from "../../../core/result/resultCode";

export async function updateCommentHandler(req: Request, res: Response) {
  const id = req.params.commentId;
  const userId = req.user!.id;
  const commentInput: commentInput = {
    ...req.body,
  };

  const upadateComments = await commentsService.updateComment(
    id,
    commentInput,
      userId!,
  );

  if (upadateComments.status === ResultStatus.NotFound) {
    res.sendStatus(HttpStatus.NotFound);
    return;
  }
  if (upadateComments.status === ResultStatus.Unauthorized) {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }
  if (upadateComments.status === ResultStatus.Forbidden) {
    res.sendStatus(HttpStatus.Forbidden);
    return;
  }
  res.sendStatus(HttpStatus.NoContent);
}
