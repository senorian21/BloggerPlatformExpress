import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { container } from "../../../composition-root";
import { PostsQueryRepository } from "../../repositories/posts.queryRepository";
import { PostsService } from "../../application/posts.service";

const postsQueryRepository = container.get(PostsQueryRepository);
const postsService = container.get(PostsService);

export async function createPostHandler(req: Request, res: Response) {
  const createdPostsId = await postsService.createPost(req.body);
  if (!createdPostsId) {
    res.sendStatus(HttpStatus.NotFound);
    return;
  }
  const newPost = await postsQueryRepository.findPostById(createdPostsId);
  res.status(HttpStatus.Created).send(newPost);
}
