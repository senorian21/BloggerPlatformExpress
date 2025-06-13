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
  async findCommentsById(id: string) {
    if (!ObjectId.isValid(id)) {
      return null;
    }

    const comment = await CommentModel.findOne({ _id: new ObjectId(id) });
    if (!comment) {
      return null;
    }
    if (!comment || comment.deletedAt !== null) {
      return null;
    }
    return mapToCommentViewModel(comment);
  }
  async findAllCommentsByPost(
    queryDto: commentsQueryInput,
    postId: string,
  ): Promise<{ items: commentViewModel[]; totalCount: number }> {
    const { pageNumber, pageSize, sortBy, sortDirection } = queryDto;

    const skip = (pageNumber - 1) * pageSize;
    const filter: any = { postId: postId, deletedAt: null };

    const items = await CommentModel.find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(+pageSize);

    const totalCount = await CommentModel.countDocuments(filter);
    return mapToCommentsListPaginatedOutput(items, {
      pageNumber: +pageNumber,
      pageSize: +pageSize,
      totalCount,
    });
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

    //const mappedComment = mapToCommentViewModel(comment, myStatus);
    //return { ...mappedComment, myStatus };
  }
}
