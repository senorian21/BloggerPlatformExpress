import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { PostInput } from "../../../posts/dto/post.input-dto";
import {container} from "../../../composition-root";
import {BlogsQueryRepositories} from "../../repositories/blogs.queryRepository";
import {PostsQueryRepository} from "../../../posts/repositories/posts.queryRepository";
import {PostsService} from "../../../posts/application/posts.service";

const blogsQueryRepositories = container.get(BlogsQueryRepositories);
const postsQueryRepository = container.get(PostsQueryRepository);
const postsService = container.get(PostsService);

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
