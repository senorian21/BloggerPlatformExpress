import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";

import { postsService } from "../../application/posts.service";
import {postsQueryRepository} from "../../repositories/posts.queryRepository";

export async function createPostHandler(req: Request, res: Response) {
  const createdPostsId = await postsService.createPost(req.body);
  if (!createdPostsId){
    res.sendStatus(HttpStatus.NotFound);
    return;
  }
  const newPost = await postsQueryRepository.findPostById(createdPostsId)
  res.status(HttpStatus.Created).send(newPost);

}
