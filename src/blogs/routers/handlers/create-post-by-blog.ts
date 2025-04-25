import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { mapToPostViewModel } from "../../../posts/mappers/map-to-post-view-model.util";
import { postsService } from "../../../posts/application/posts.service";
import { PostInput } from "../../../posts/dto/post.input-dto";
import { blogsQueryRepositories } from "../../repositories/blogs.queryRepository";
import { postsQueryRepository } from "../../../posts/repositories/posts.queryRepository";

export async function createPostByBlogHandler(
  req: Request<{ blogId: string }>,
  res: Response,
) {
  const idBlog = req.params.blogId;
  const blog = await blogsQueryRepositories.findById(idBlog);
  if (!blog) {
    res.sendStatus(HttpStatus.NotFound);
  }
  const postInput: PostInput = {
    ...req.body,
    blogId: idBlog,
  };

  const createdPostsId = await postsService.createPost(postInput);
  if (!createdPostsId) {
    res.sendStatus(HttpStatus.NotFound);
    return;
  }
  const newPostByBlog = await postsQueryRepository.findPostById(createdPostsId);
  if (newPostByBlog) {
    res.status(HttpStatus.Created).send(newPostByBlog);
  } else {
    res.sendStatus(HttpStatus.NotFound);
  }
}
