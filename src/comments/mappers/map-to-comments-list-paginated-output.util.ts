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
  console.log(`mapping work`);
  return {
    pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
    page: meta.pageNumber,
    pageSize: meta.pageSize,
    totalCount: meta.totalCount,
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
}
