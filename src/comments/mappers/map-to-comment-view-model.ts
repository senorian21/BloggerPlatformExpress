import { commentViewModel } from "../types/comment-view-model";
import { commentDocument } from "../domain/comment.entity";
import { likeStatus } from "../../like/domain/like.entity";

export function mapToCommentViewModel(
  comment: commentDocument,
  myStatus: likeStatus,
): commentViewModel {
  return {
    id: comment._id.toString(),
    content: comment.content,
    commentatorInfo: {
      userId: comment.commentatorInfo.userId,
      userLogin: comment.commentatorInfo.userLogin,
    },
    createdAt: comment.createdAt,
    likesInfo: {
      likesCount: comment.likeCount,
      dislikesCount: comment.dislikeCount,
      myStatus: myStatus,
    },
  };
}
