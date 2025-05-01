import { comment } from "../types/comment";
import { commentCollection } from "../../db/mongo.db";
import { ResultStatus } from "../../core/result/resultCode";
import { Result } from "../../core/result/result.type";

export const commentsRepositories = {
  async createComment(newComment: comment): Promise<Result<string>> {
    const result = await commentCollection.insertOne(newComment);
    return {
      status: ResultStatus.Success,
      data: result.insertedId.toString(),
      extensions: [],
    };
  },
};
