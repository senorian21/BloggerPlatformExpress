import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { container } from "../../../composition-root";
import { PostsService } from "../../application/posts.service";
import { PostsQueryRepository } from "../../repositories/posts.queryRepository";

const postsService = container.get(PostsService);
const postsQueryRepository = container.get(PostsQueryRepository);

export async function deletePostHandler(req: Request, res: Response) {
  const id = req.params.id;
  const post = await postsQueryRepository.findPostById(id);
  if (!post) {
    res.sendStatus(HttpStatus.NotFound);
    return;
  }
  postsService.deletePost(id);
  res.sendStatus(HttpStatus.NoContent);
}
