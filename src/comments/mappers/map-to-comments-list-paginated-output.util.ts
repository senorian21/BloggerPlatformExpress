import { WithId } from "mongodb";
import {comment} from "../types/comment";
import {commentViewModel} from "../types/comment-view-model";


export function mapToCommentsListPaginatedOutput(
    comment: WithId<comment>[],
  meta: { pageNumber: number; pageSize: number; totalCount: number },
): {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: commentViewModel[];
} {
  return {
    pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
    page: meta.pageNumber,
    pageSize: meta.pageSize,
    totalCount: meta.totalCount,
    items: comment.map((comment) => ({
      id: comment._id.toString(),
      content: comment.content,
      commentatorInfo: {
        userId: comment.commentatorInfo.userId,
        userLogin: comment.commentatorInfo.userLogin
      },
      createdAt: comment.createdAt,
    })),
  };
}
