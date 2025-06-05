import { comment } from "../types/comment";
import { commentCollection } from "../../db/mongo.db";
import { ResultStatus } from "../../core/result/resultCode";
import { Result } from "../../core/result/result.type";
import { ObjectId } from "mongodb";

export class CommentsRepositories {
  async createComment(newComment: comment): Promise<Result<string>> {
    const result = await commentCollection.insertOne(newComment);
    return {
      status: ResultStatus.Success,
      data: result.insertedId.toString(),
      extensions: [],
    };
  }
  async findCommentsById(id: string) {
    if (!ObjectId.isValid(id)) {
      return null;
    }

    const comment = await commentCollection.findOne({ _id: new ObjectId(id) });
    if (!comment) {
      return null;
    }

    return comment;
  }
  async updateComment(idComment: string, dto: comment): Promise<Result> {
    if (!ObjectId.isValid(idComment)) {
      return {
        status: ResultStatus.NotFound,
        data: null,
        errorMessage: "Invalid comment ID",
        extensions: [],
      };
    }

    const updateResult = await commentCollection.updateOne(
      {
        _id: new ObjectId(idComment),
      },
      {
        $set: {
          postId: dto.postId,
          content: dto.content,
          commentatorInfo: {
            userId: dto.commentatorInfo.userId,
            userLogin: dto.commentatorInfo.userLogin,
          },
          createdAt: dto.createdAt,
        },
      },
    );

    if (updateResult.modifiedCount === 0) {
      return {
        status: ResultStatus.BadRequest,
        data: null,
        errorMessage: "No changes were made to the comment",
        extensions: [],
      };
    }

    return {
      status: ResultStatus.Success,
      data: null,
      extensions: [],
    };
  }
  async deleteComment(idComment: string): Promise<Result> {
    if (!ObjectId.isValid(idComment)) {
      return {
        status: ResultStatus.NotFound,
        data: null,
        errorMessage: "Invalid comment ID",
        extensions: [],
      };
    }
    const deleteComment = await commentCollection.deleteOne({
      _id: new ObjectId(idComment),
    });
    if (deleteComment.deletedCount === 0) {
      return {
        status: ResultStatus.NotFound,
        data: null,
        extensions: [],
      };
    }
    return {
      status: ResultStatus.Success,
      data: null,
      extensions: [],
    };
  }
}
