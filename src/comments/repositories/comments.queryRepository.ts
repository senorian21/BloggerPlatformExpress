import { ObjectId } from "mongodb";
import { mapToCommentViewModel } from "../mappers/map-to-comment-view-model";
import { commentsQueryInput } from "../types/comments-query.input";
import { commentViewModel } from "../types/comment-view-model";
import { mapToCommentsListPaginatedOutput } from "../mappers/map-to-comments-list-paginated-output.util";
import { CommentModel } from "../domain/comment.entity";
import { injectable } from "inversify";
import { likeStatus } from "../../like/domain/like.entity";
import { CommentsRepositories } from "./comments.Repository";

@injectable()
export class CommentsQueryRepositories {
  constructor(public commentsRepositories: CommentsRepositories) {}

  async findAllCommentsByPost(
    queryDto: commentsQueryInput,
    postId: string,
    userId?: string | null,
  ): Promise<{ items: commentViewModel[]; totalCount: number }> {
    const { pageNumber, pageSize, sortBy, sortDirection } = queryDto;

    const skip = (pageNumber - 1) * pageSize;
    const filter = { postId, deletedAt: null };

    const rawComments = await CommentModel.find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(+pageSize);

    const totalCount = await CommentModel.countDocuments(filter);

    console.log("rawComments", rawComments);

    if (!userId) {
      const defaultStatusArray = Array(rawComments.length).fill(
        likeStatus.None,
      );
      const result = mapToCommentsListPaginatedOutput(
        rawComments,
        defaultStatusArray,
        {
          pageNumber: +pageNumber,
          pageSize: +pageSize,
          totalCount,
        },
      );
      return {
        items: result.items,
        totalCount: result.totalCount,
      };
    }

    const myStatusArray = await Promise.all(
      rawComments.map(async (comment) => {
        const userLike = await this.commentsRepositories.findLikeByidUser(
          userId,
          comment._id.toString(),
        );
        return userLike?.status ?? likeStatus.None;
      }),
    );

    const result = mapToCommentsListPaginatedOutput(
      rawComments,
      myStatusArray,
      {
        pageNumber: +pageNumber,
        pageSize: +pageSize,
        totalCount,
      },
    );

    return {
      items: result.items,
      totalCount: result.totalCount,
    };
  }

  async findCommentsByIdLike(id: string, userId?: string | null) {
    const comment = await CommentModel.findOne({ _id: new ObjectId(id) });
    if (!comment || comment.deletedAt !== null) {
      return null;
    }

    let myStatus: likeStatus = likeStatus.None;

    if (userId) {
      const userLike = await this.commentsRepositories.findLikeByidUser(
        userId,
        id,
      );

      if (userLike) {
        myStatus = userLike.status;
      }
    }

    const mappedComment = mapToCommentViewModel(comment, myStatus);
    return mappedComment;
  }
}
