import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";

import { mapToBlogViewModel } from "../../mappers/map-to-blog-view-model.util";
import { blogsService } from "../../application/blogs.service";
import { BlogsQueryInput } from "../../types/blog-query.input";
import { mapToBlogListPaginatedOutput } from "../../mappers/map-to-blog-list-paginated-output.util";

export async function getBlogsListHandler(
  req: Request<{}, {}, {}, BlogsQueryInput>,
  res: Response,
) {
  // const blog = await blogsService.findMany();
  // const blogsViewModel = blog.map(mapToBlogViewModel);
  // res.status(HttpStatus.Ok).send(blogsViewModel);
  try{

    const queryInput = req.query;
    console.log(queryInput);
    const { items, totalCount } = await blogsService.findMany(queryInput);
    const blogsListOutput = mapToBlogListPaginatedOutput(items, {
      pageNumber: queryInput.pageNumber,
      pageSize: queryInput.pageSize,
      totalCount,
    });
    res.send(blogsListOutput);
  } catch (e) {
    console.error(e);
    res.status(HttpStatus.InternalServerError).json({ message: "Ошибка при получении списка блогов" });
  }

}
