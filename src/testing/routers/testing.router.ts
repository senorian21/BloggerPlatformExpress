import { Router, Request, Response } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { BlogModel } from "../../blogs/domain/blog.entity";
import { PostModel } from "../../posts/domain/post.entity";
import { CommentModel } from "../../comments/domain/comment.entity";
import { UserModel } from "../../users/domain/user.entity";

export const testingRouter = Router({});

testingRouter.delete("/all-data", async (request: Request, res: Response) => {
  await Promise.all([
    BlogModel.deleteMany(),
    PostModel.deleteMany(),
    CommentModel.deleteMany(),
    UserModel.deleteMany(),
  ]);
  res.sendStatus(HttpStatus.NoContent);
});
