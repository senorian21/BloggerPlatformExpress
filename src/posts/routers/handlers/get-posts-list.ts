import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { paginationAndSortingDefault } from "../../../core/middlewares/validation/query-pagination-sorting.validation-middleware";
import { PostQueryInput } from "../../types/post-query.input";
import { container } from "../../../composition-root";
import { PostsQueryRepository } from "../../repositories/posts.queryRepository";

const postsQueryRepository = container.get(PostsQueryRepository);

export async function getPostsListHandler(req: Request, res: Response) {
  const userId = req.user?.id;
  const queryInput: PostQueryInput = {
    ...paginationAndSortingDefault,
    ...req.query,
  } as PostQueryInput;

  const posts = await postsQueryRepository.findAllPosts(
    queryInput,
    undefined,
    userId,
  );
  res.send(posts);
}
