import { WithId } from "mongodb";
import { commentViewModel } from "../types/comment-view-model";
import { comment } from "../domain/comment.entity";
import { likeStatus } from "../../like/domain/like.entity";

export function mapToCommentsListPaginatedOutput(
  comments: WithId<comment>[],
  myStatusArray: likeStatus[],
  meta: { pageNumber: number; pageSize: number; totalCount: number },
): {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: commentViewModel[];
} {
  const { pageNumber, pageSize, totalCount } = meta;
  const res = {
    pagesCount: Math.ceil(totalCount / pageSize),
    page: pageNumber,
    pageSize: pageSize,
    totalCount: totalCount,
    items: comments.map((comment, index) => ({
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
        myStatus: myStatusArray[index],
      },
    })),
  };
  return res;
}
