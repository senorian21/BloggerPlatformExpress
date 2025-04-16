import { Request, Response } from "express";

import { mapToPostViewModel } from "../../../posts/mappers/map-to-post-view-model.util";
import { postsService } from "../../../posts/application/posts.service";

export async function getDriverRideListHandler(
  req: Request<{ id: string }, {}, {}>,
  res: Response,
) {
  const blogId = req.params.id;
  const posts = await postsService.findAllPostsByBlogId(blogId);
  if (Array.isArray(posts)) {
    const postsListOutput = posts.map(mapToPostViewModel);
    res.send(postsListOutput);
  }
}
