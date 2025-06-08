import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { BlogsQueryInput } from "../../types/blog-query.input";
import { paginationAndSortingDefault } from "../../../core/middlewares/validation/query-pagination-sorting.validation-middleware";
import {container} from "../../../composition-root";
import {BlogsQueryRepositories} from "../../repositories/blogs.queryRepository";

const blogsQueryRepositories = container.get(BlogsQueryRepositories);

export async function getBlogsListHandler(
  req: Request<{}, {}, {}, BlogsQueryInput>,
  res: Response,
) {
  try {
    const queryInput: BlogsQueryInput = {
      ...paginationAndSortingDefault,
      pageNumber:
        Number(req.query.pageNumber) || paginationAndSortingDefault.pageNumber,
      pageSize:
        Number(req.query.pageSize) || paginationAndSortingDefault.pageSize,
      sortBy: req.query.sortBy || paginationAndSortingDefault.sortBy,
      sortDirection:
        req.query.sortDirection || paginationAndSortingDefault.sortDirection,
      searchNameTerm: req.query.searchNameTerm || "",
    };
    const blogsListOutput =
      await blogsQueryRepositories.findAllBlogs(queryInput);

    res.send(blogsListOutput);
  } catch (e) {
    console.error(e);
    res
      .status(HttpStatus.InternalServerError)
      .json({ message: "Ошибка при получении списка блогов" });
  }
}
