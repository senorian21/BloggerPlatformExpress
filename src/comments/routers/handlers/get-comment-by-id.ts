import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { container } from "../../../composition-root";
import { CommentsQueryRepositories } from "../../repositories/comments.queryRepository";

const commentsQueryRepositories = container.get(CommentsQueryRepositories);

export async function getCommentByIdHandler(req: Request, res: Response) {
  const id = req.params.commentId;
  const findComments = await commentsQueryRepositories.findCommentsById(id);
  if (!findComments) {
    res.sendStatus(HttpStatus.NotFound);
  }
  res.status(HttpStatus.Ok).send(findComments);
}
