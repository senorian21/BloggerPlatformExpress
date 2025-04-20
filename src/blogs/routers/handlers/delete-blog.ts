import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { blogsService } from "../../application/blogs.service";

export async function deleteBlogHandler(req: Request, res: Response) {
  try {
    const id = req.params.blogId;
    const blog = await blogsService.findById(id);
    if (!blog) {
      res.sendStatus(HttpStatus.NotFound);
    }
    blogsService.deleteBlog(id);
    res.sendStatus(HttpStatus.NoContent);
  } catch (e) {
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
