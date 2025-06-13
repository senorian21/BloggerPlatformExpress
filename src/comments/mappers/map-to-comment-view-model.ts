import { WithId } from "mongodb";
import { comment } from "../types/comment";
import { commentViewModel } from "../types/comment-view-model";

export function mapToCommentViewModel(
  comment: WithId<comment>,
): commentViewModel {
  return {
    id: comment._id.toString(),
    content: comment.content,
    commentatorInfo: {
      userId: comment.commentatorInfo.userId,
      userLogin: comment.commentatorInfo.userLogin,
    },
    createdAt: comment.createdAt,
  };
}
