import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { container } from "../../../composition-root";
import { CommentsQueryRepositories } from "../../repositories/comments.queryRepository";

const commentsQueryRepositories = container.get(CommentsQueryRepositories);

export async function getCommentByIdHandler(req: Request, res: Response) {
  const userId = req.user?.id ?? null;
  const id = req.params.commentId;
  const findComments = await commentsQueryRepositories.findCommentsByIdLike(
    id,
    userId,
  );
  if (!findComments) {
    res.sendStatus(HttpStatus.NotFound);
  }
  res.status(HttpStatus.Ok).send(findComments);
}
