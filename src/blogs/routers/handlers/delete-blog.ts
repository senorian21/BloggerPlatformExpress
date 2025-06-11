import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { container } from "../../../composition-root";
import { BlogsService } from "../../application/blogs.service";

const blogsService = container.get(BlogsService);

export async function deleteBlogHandler(req: Request, res: Response) {
  try {
    const id = req.params.blogId;
    const isDeleted = await blogsService.deleteBlog(id);

    if (!isDeleted) {
      res.sendStatus(HttpStatus.NotFound);
      return;
    }

    res.sendStatus(HttpStatus.NoContent);
  } catch (e) {
    console.error("Error deleting blog:", e);
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
