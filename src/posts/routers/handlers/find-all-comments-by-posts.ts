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
  req: Request<{ postId: string }, any, {}, {}>,
  res: Response,
) {
  const userId = req.user?.id ?? null;
  const postId = req.params.postId;
  console.log("post comment handler");
  const post = await postsQueryRepository.findPostById(postId);

  if (!post) {
    res.sendStatus(HttpStatus.NotFound);
    return;
  }

  const queryInput = {
    ...paginationAndSortingDefault,
    ...req.query,
  } as commentsQueryInput;

  const allCommentsByPost =
    await commentsQueryRepositories.findAllCommentsByPost(
      queryInput,
      postId,
      userId,
    );

  res.status(HttpStatus.Ok).send(allCommentsByPost);
}
