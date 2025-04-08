import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { Post } from "../../../posts/types/post";
import { postsRepository } from "../../repositories/posts.repository";
import { blogsRepositories } from "../../../blogs/repositories/blogs.repository";
import { mapToPostViewModel } from "../../mappers/map-to-post-view-model.util";

export async function createPostHandler(req: Request, res: Response) {
  const blogId = req.body.blogId;

  const blog = await blogsRepositories.findById(blogId);

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

  const createdPosts = await postsRepository.createPost(newPost);
  const postViewModel = mapToPostViewModel(createdPosts);
  res.status(HttpStatus.Created).send(postViewModel);
}
