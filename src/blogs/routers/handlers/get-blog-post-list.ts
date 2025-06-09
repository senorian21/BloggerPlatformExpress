import { Request, Response } from "express";
import { PostQueryInput } from "../../../posts/types/post-query.input";
import {
  paginationAndSortingDefault,
  PostSortField,
} from "../../../core/middlewares/validation/query-pagination-sorting.validation-middleware";
import { HttpStatus } from "../../../core/types/http-statuses";
import { SortDirection } from "../../../core/types/sort-direction";
import { container } from "../../../composition-root";
import { BlogsQueryRepositories } from "../../repositories/blogs.queryRepository";
import { PostsQueryRepository } from "../../../posts/repositories/posts.queryRepository";

const blogsQueryRepositories = container.get(BlogsQueryRepositories);
const postsQueryRepository = container.get(PostsQueryRepository);

export async function getBlogPostsListHandler(
  req: Request<{ blogId: string }, {}, PostQueryInput>,
  res: Response,
) {
  try {
    const idBlog = req.params.blogId;
    const blog = await blogsQueryRepositories.findById(idBlog);
    if (!blog) {
      res.sendStatus(HttpStatus.NotFound);
      return;
    }
    const queryInput: PostQueryInput = {
      ...paginationAndSortingDefault,
      pageNumber:
        parseInt(req.query.pageNumber as string, 10) ||
        paginationAndSortingDefault.pageNumber,
      pageSize:
        parseInt(req.query.pageSize as string, 10) ||
        paginationAndSortingDefault.pageSize,
      sortBy:
        (req.query.sortBy as PostSortField) ||
        paginationAndSortingDefault.sortBy,
      sortDirection:
        (req.query.sortDirection as SortDirection) ||
        paginationAndSortingDefault.sortDirection,
    };

    const postsByBlog = await postsQueryRepository.findAllPostsByBlogId(
      queryInput,
      idBlog,
    );

    res.send(postsByBlog);
  } catch (err) {
    console.error("Error fetching blog posts:", err);
    res.status(HttpStatus.InternalServerError).json({
      message: "Ошибка при получении списка постов конкретного блога",
    });
  }
}
