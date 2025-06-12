import { Request, Response } from "express";
import { commentsQueryInput } from "../../../comments/types/comments-query.input";
import { paginationAndSortingDefault } from "../../../core/middlewares/validation/query-pagination-sorting.validation-middleware";
import { HttpStatus } from "../../../core/types/http-statuses";
import { container } from "../../../composition-root";
import { PostsQueryRepository } from "../../repositories/posts.queryRepository";
import { CommentsQueryRepositories } from "../../../comments/repositories/comments.queryRepository";

const commentsQueryRepositories = container.get(CommentsQueryRepositories);
const postsQueryRepository = container.get(PostsQueryRepository);

export async function getPostCommentsListHandler(
  req: Request<{ postId: string }, {}, {}, commentsQueryInput>,
  res: Response,
) {
  const postId = req.params.postId;
  const post = await postsQueryRepository.findPostById(postId);

  if (!post) {
    res.sendStatus(HttpStatus.NotFound); // Завершаем выполнение функции
    return;
  }

  const queryInput: commentsQueryInput = {
    ...paginationAndSortingDefault,
    ...req.query,
  };

  const allCommentsByPost =
    await commentsQueryRepositories.findAllCommentsByPost(queryInput, postId);

  res.status(HttpStatus.Ok).send(allCommentsByPost);
}
