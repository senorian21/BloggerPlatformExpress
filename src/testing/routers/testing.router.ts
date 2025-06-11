import { Router, Request, Response } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { BlogModel } from "../../blogs/domain/blog.entity";
import { PostModel } from "../../posts/domain/post.entity";
import { CommentModel } from "../../comments/domain/comment.entity";
import { UserModel } from "../../users/domain/user.entity";
import { SessionModel } from "../../auth/domain/session.entity";
import { RateModel } from "../../auth/domain/rate.entity";

export const testingRouter = Router({});

testingRouter.delete("/all-data", async (req: Request, res: Response) => {
  await Promise.all([
    BlogModel.deleteMany(),
    PostModel.deleteMany(),
    CommentModel.deleteMany(),
    UserModel.deleteMany(),
    SessionModel.deleteMany(),
    RateModel.deleteMany(),
  ]);
  res.sendStatus(HttpStatus.NoContent);
});
