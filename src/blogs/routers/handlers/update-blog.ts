import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { BlogInput } from "../../dto/blog.input-dto";
import { container } from "../../../composition-root";
import { BlogsQueryRepositories } from "../../repositories/blogs.queryRepository";
import { BlogsService } from "../../application/blogs.service";

const blogsQueryRepositories = container.get(BlogsQueryRepositories);
const blogsService = container.get(BlogsService);

export async function putBlogHandler(req: Request, res: Response) {
  const id = req.params.blogId;
  const blogInput: BlogInput = {
    ...req.body,
  };
  await blogsService.updateBlog(id, blogInput);
  res.sendStatus(HttpStatus.NoContent);
}
