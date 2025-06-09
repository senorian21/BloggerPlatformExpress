import { ObjectId } from "mongodb";
import { mapToBlogViewModel } from "../mappers/map-to-comment-view-model";
import { commentsQueryInput } from "../types/comments-query.input";
import { commentViewModel } from "../types/comment-view-model";
import { mapToCommentsListPaginatedOutput } from "../mappers/map-to-comments-list-paginated-output.util";
import { CommentModel } from "../domain/comment.entity";

export const commentsQueryRepositories = {
  async findCommentsById(id: string) {
    if (!ObjectId.isValid(id)) {
      return null;
    }

    const comment = await CommentModel.findOne({ _id: new ObjectId(id) });
    if (!comment) {
      return null;
    }

    return mapToBlogViewModel(comment);
  },
  async findAllCommentsByPost(
    queryDto: commentsQueryInput,
    postId: string,
  ): Promise<{ items: commentViewModel[]; totalCount: number }> {
    const { pageNumber, pageSize, sortBy, sortDirection } = queryDto;

    const skip = (pageNumber - 1) * pageSize;
    const filter: any = { postId: postId };

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
  },
};
