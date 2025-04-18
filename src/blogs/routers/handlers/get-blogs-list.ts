import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { blogsService } from "../../application/blogs.service";
import { BlogsQueryInput } from "../../types/blog-query.input";
import { mapToBlogListPaginatedOutput } from "../../mappers/map-to-blog-list-paginated-output.util";
import { paginationAndSortingDefault } from "../../../core/middlewares/validation/query-pagination-sorting.validation-middleware";

export async function getBlogsListHandler(
  req: Request<{}, {}, {}, BlogsQueryInput>,
  res: Response,
) {
  try {
    const queryInput: BlogsQueryInput = {
      ...paginationAndSortingDefault,
      ...req.query,
    };
    const { items, totalCount } = await blogsService.findMany(queryInput);
    const blogsListOutput = mapToBlogListPaginatedOutput(items, {
      pageNumber: +queryInput.pageNumber,
      pageSize: +queryInput.pageSize,
      totalCount,
    });
    res.send(blogsListOutput);
  } catch (e) {
    console.error(e);
    res
      .status(HttpStatus.InternalServerError)
      .json({ message: "Ошибка при получении списка блогов" });
  }
}
