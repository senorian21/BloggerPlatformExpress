import { Request, Response } from "express";

import { mapToPostViewModel } from "../../../posts/mappers/map-to-post-view-model.util";
import { postsService } from "../../../posts/application/posts.service";

export async function getBlogPostsListHandler(
  req: Request<{ blogId: string }, {}, {}>,
  res: Response,
) {
  const idBlog = req.params.blogId;
  const posts = await postsService.findAllPostsByBlogId(idBlog);
  if (Array.isArray(posts)) {
    const postsListOutput = posts.map(mapToPostViewModel);
    res.send(postsListOutput);
  }
}
