import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { Post } from "../../../posts/types/post";
import { postsService } from "../../application/posts.service";
import { blogsQueryRepositories } from "../../../blogs/repositories/blogs.queryRepository";
import {postsQueryRepository} from "../../repositories/posts.queryRepository";

export async function updatePostHandler(req: Request, res: Response) {
  const id = req.params.id;

  const blogId = req.body.blogId;
  const blog = await blogsQueryRepositories.findById(blogId);
  if (!blog) {
    res.sendStatus(HttpStatus.NotFound);
    return;
  }

  const post = await postsQueryRepository.findPostById(id);
  if (!post) {
    res.sendStatus(HttpStatus.NotFound);
    return;
  }

  const dto: Post = {
    ...post,
    title: req.body.title,
    shortDescription: req.body.shortDescription,
    content: req.body.content,
    blogId: blog._id.toString(),
    blogName: blog.name,
  };

  postsService.updatePost(id, dto);

  res.sendStatus(HttpStatus.NoContent);
}
