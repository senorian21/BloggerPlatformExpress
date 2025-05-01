import { blogCollection, commentCollection } from "../../db/mongo.db";
import { ObjectId } from "mongodb";
import { mapToBlogViewModel } from "../mappers/map-to-comment-view-model";
import { commentsQueryInput } from "../types/comments-query.input";
import { commentViewModel } from "../types/comment-view-model";
import { mapToCommentsListPaginatedOutput } from "../mappers/map-to-comments-list-paginated-output.util";

export const commentsQueryRepositories = {
  async findCommentsById(id: string) {
    if (!ObjectId.isValid(id)) {
      return null;
    }

    const comment = await commentCollection.findOne({ _id: new ObjectId(id) });
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

    const items = await commentCollection
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(+pageSize)
      .toArray();

    const totalCount = await commentCollection.countDocuments(filter);
    return mapToCommentsListPaginatedOutput(items, {
      pageNumber: +pageNumber,
      pageSize: +pageSize,
      totalCount,
    });
  },
};
