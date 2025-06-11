import { comment } from "../types/comment";
import { ResultStatus } from "../../core/result/resultCode";
import { Result } from "../../core/result/result.type";
import { ObjectId } from "mongodb";
import { injectable } from "inversify";
import { commentDocument, CommentModel } from "../domain/comment.entity";

@injectable()
export class CommentsRepositories {
  async save(comment: commentDocument) {
    await comment.save();
  }

  async findById(id: string) {
    const comment = await CommentModel.findById(id);
    if (!comment || comment.deletedAt !== null) {
      return null;
    }
    return comment;
  }
}
