import { Router, Request, Response } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import {
  blogCollection,
  commentCollection,
  postCollection,
  rateCollection,
  sessionCollection,
  userCollection,
} from "../../db/mongo.db";

export const testingRouter = Router({});

testingRouter.delete("/all-data", async (request: Request, res: Response) => {
  await Promise.all([
    blogCollection.deleteMany(),
    postCollection.deleteMany(),
    userCollection.deleteMany(),
    commentCollection.deleteMany(),
    sessionCollection.deleteMany(),
    rateCollection.deleteMany(),
  ]);
  res.sendStatus(HttpStatus.NoContent);
});
