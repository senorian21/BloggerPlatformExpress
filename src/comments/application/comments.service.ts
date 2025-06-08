import { commentInput } from "../dto/comment.input-dto";
import { ResultStatus } from "../../core/result/resultCode";
import { UserQueryRepository } from "../../users/repositories/users.queryRepository";
import { comment } from "../types/comment";
import { CommentsRepositories } from "../repositories/comments.Repository";
import { Result } from "../../core/result/result.type";
import { injectable } from "inversify";
@injectable()
export class CommentsService {
  constructor(
    public userQueryRepository: UserQueryRepository,
    public commentsRepositories: CommentsRepositories,
  ) {}
  async createComment(
    dto: commentInput,
    userId: string,
    postId: string,
  ): Promise<Result<string | null>> {
    const user = await this.userQueryRepository.findUserById(userId);

    if (!user) {
      return {
        status: ResultStatus.Unauthorized,
        data: null,
        errorMessage: "User not found",
        extensions: [
          { field: "user", message: "User with the given ID does not exist" },
        ],
      };
    }

    const newComment: comment = {
      postId: postId,
      content: dto.content,
      commentatorInfo: {
        userId: user.id,
        userLogin: user.login,
      },
      createdAt: new Date().toISOString(),
    };

    return this.commentsRepositories.createComment(newComment);
  }

  async updateComment(
    idComment: string,
    dto: commentInput,
    userId: string,
  ): Promise<Result<string | null>> {
    const comment = await this.commentsRepositories.findCommentsById(idComment);

    if (!comment) {
      return {
        status: ResultStatus.NotFound,
        data: null,
        errorMessage: "Comment not found",
        extensions: [
          { field: "comment", message: "No such comment was found." },
        ],
      };
    }

    if (comment.commentatorInfo.userId !== userId) {
      return {
        status: ResultStatus.Forbidden,
        data: null,
        errorMessage: "Forbidden to update this comment",
        extensions: [
          {
            field: "Forbidden",
            message: "You are not the owner of this comment",
          },
        ],
      };
    }

    const updatedComment: comment = {
      postId: comment.postId,
      content: dto.content,
      commentatorInfo: {
        userId: comment.commentatorInfo.userId,
        userLogin: comment.commentatorInfo.userLogin,
      },
      createdAt: comment.createdAt,
    };

    return await this.commentsRepositories.updateComment(
      idComment,
      updatedComment,
    );
  }
  async deleteComment(idComment: string, userId: string) {
    const comment = await this.commentsRepositories.findCommentsById(idComment);

    if (!comment) {
      return {
        status: ResultStatus.NotFound,
        data: null,
        errorMessage: "Comment not found",
        extensions: [
          { field: "comment", message: "No such comment was found." },
        ],
      };
    }

    if (comment.commentatorInfo.userId !== userId) {
      return {
        status: ResultStatus.Forbidden,
        data: null,
        errorMessage: "Unauthorized to update this comment",
        extensions: [
          { field: "user", message: "You are not the owner of this comment" },
        ],
      };
    }
    return this.commentsRepositories.deleteComment(idComment);
  }
}
