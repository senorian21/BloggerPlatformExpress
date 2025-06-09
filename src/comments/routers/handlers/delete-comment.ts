import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { ResultStatus } from "../../../core/result/resultCode";
import { container } from "../../../composition-root";
import { CommentsService } from "../../application/comments.service";

const commentsService = container.get(CommentsService);

export async function deleteCommentHandler(req: Request, res: Response) {
  const id = req.params.commentId;
  const userId = req.user!.id;

  const deleteComments = await commentsService.deleteComment(id, userId);
  if (deleteComments.status === ResultStatus.NotFound) {
    res.sendStatus(HttpStatus.NotFound);
    return;
  }
  if (deleteComments.status === ResultStatus.Unauthorized) {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }
  if (deleteComments.status === ResultStatus.Forbidden) {
    res.sendStatus(HttpStatus.Forbidden);
    return;
  }
  res.sendStatus(HttpStatus.NoContent);
}
