import { comment } from "../types/comment";
import { ResultStatus } from "../../core/result/resultCode";
import { Result } from "../../core/result/result.type";
import { ObjectId } from "mongodb";
import { injectable } from "inversify";
import { CommentModel } from "../domain/comment.entity";

@injectable()
export class CommentsRepositories {
  async createComment(newComment: comment): Promise<Result<string>> {
    const commentInstance = new CommentModel(newComment);
    await commentInstance.save();
    return {
      status: ResultStatus.Success,
      data: commentInstance._id.toString(),
      extensions: [],
    };
  }

  async findCommentsById(id: string) {
    if (!ObjectId.isValid(id)) {
      return null;
    }
    const comment = await CommentModel.findOne({ _id: new ObjectId(id) });
    if (!comment) {
      return null;
    }
    return comment;
  }

  async updateComment(idComment: string, dto: comment): Promise<Result> {
    const commentInstance = await CommentModel.findOne({ _id: idComment });

    if (!commentInstance) {
      return {
        status: ResultStatus.BadRequest,
        data: null,
        errorMessage: "Comment not found",
        extensions: [],
      };
    }

    commentInstance.content = dto.content;
    commentInstance.postId = dto.postId;
    commentInstance.commentatorInfo.userId = dto.commentatorInfo.userId;
    commentInstance.commentatorInfo.userLogin = dto.commentatorInfo.userLogin;
    commentInstance.createdAt = dto.createdAt;

    const updateResult = await commentInstance.save();


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
    const deleteComment = await CommentModel.deleteOne({
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
