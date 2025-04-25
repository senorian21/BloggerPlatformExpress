import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { paginationAndSortingDefault } from "../../../core/middlewares/validation/query-pagination-sorting.validation-middleware";
import { PostQueryInput } from "../../types/post-query.input";
import { postsQueryRepository } from "../../repositories/posts.queryRepository";

export async function getPostsListHandler(
  req: Request<{}, {}, {}, PostQueryInput>,
  res: Response,
) {
  try {
    const queryInput: PostQueryInput = {
      ...paginationAndSortingDefault,
      ...req.query,
    };
    const posts = await postsQueryRepository.findAllPosts(queryInput);

    res.send(posts);
  } catch (e) {
    console.error(e);
    res
      .status(HttpStatus.InternalServerError)
      .json({ message: "Ошибка при получении списка постов" });
  }
}
