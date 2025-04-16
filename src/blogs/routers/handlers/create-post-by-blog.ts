import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { Post } from "../../../posts/types/post";

import { mapToPostViewModel } from "../../../posts/mappers/map-to-post-view-model.util";
import { blogsService } from "../../application/blogs.service";
import { postsService } from "../../../posts/application/posts.service";

export async function createPostByBlogHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  const blogId = req.params.id;

  const blog = await blogsService.findById(blogId);

  if (!blog) {
    return;
  }

  const newPost: Post = {
    title: req.body.title,
    shortDescription: req.body.shortDescription,
    content: req.body.content,
    blogId: blog._id.toString(),
    blogName: blog.name,
    createdAt: new Date().toISOString(),
  };

  const createdPosts = await postsService.createPost(newPost);
  if (createdPosts) {
    const postViewModel = mapToPostViewModel(createdPosts);
    res.status(HttpStatus.Created).send(postViewModel);
  }
}
