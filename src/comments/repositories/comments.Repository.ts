import { injectable } from "inversify";
import { commentDocument, CommentModel } from "../domain/comment.entity";
import {
  LikeCommentModel,
  likeCommentsDocument,
} from "../../like/domain/like.entity";

@injectable()
export class CommentsRepositories {
  async save(comment: commentDocument) {
    await comment.save();
  }

  async saveLike(like: likeCommentsDocument) {
    await like.save();
  }

  async findById(id: string) {
    const comment = await CommentModel.findById(id);
    if (!comment || comment.deletedAt !== null) {
      return null;
    }
    return comment;
  }

  async findLikeByidUser(userId: string, commentId: string | string[]) {
    const userLike = await LikeCommentModel.findOne({ userId, commentId });
    return userLike;
  }
}
