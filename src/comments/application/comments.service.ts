import { commentInput } from "../dto/comment.input-dto";
import { jwtService } from "../../auth/adapters/jwt.service";
import { ResultStatus } from "../../core/result/resultCode";
import { userQueryRepository } from "../../users/repositories/users.queryRepository";
import { comment } from "../types/comment";
import { commentsRepositories } from "../repositories/comments.Repository";
import { Result } from "../../core/result/result.type";

export async function accessTokenGuard(header: string) {
  // Проверка наличия заголовка
  if (!header) {
    return {
      status: ResultStatus.Unauthorized,
      data: null,
      errorMessage: "Header is missing",
      extensions: [
        { field: "header", message: "Request headers are required" },
      ],
    };
  }

  // Разбор заголовка Authorization
  const authHeaderParts = header.split(" ");
  if (authHeaderParts.length !== 2 || authHeaderParts[0] !== "Bearer") {
    return {
      status: ResultStatus.Unauthorized,
      data: null,
      errorMessage: "Invalid authorization type",
      extensions: [
        {
          field: "authorization",
          message: "Expected 'Bearer' as authorization type",
        },
      ],
    };
  }

  const [, token] = authHeaderParts;

  // Проверка токена
  const payload = await jwtService.verifyToken(token);
  if (!payload || !payload.userId) {
    return {
      status: ResultStatus.Unauthorized,
      data: null,
      errorMessage: "Invalid or expired token",
      extensions: [
        {
          field: "token",
          message: "The provided token is invalid or has expired",
        },
      ],
    };
  }

  return {
    status: ResultStatus.Success,
    data: { userId: payload.userId },
    extensions: [],
  };
}

export const commentsService = {
  async createComment(
    dto: commentInput,
    header: string,
    postId: string,
  ): Promise<Result<string | null>> {
    const result = await accessTokenGuard(header);

    if (result.status !== ResultStatus.Success) {
      return {
        status: ResultStatus.Unauthorized,
        data: null,
        errorMessage: "Unauthorized",
        extensions: [],
      };
    }

    const user = await userQueryRepository.findUserById(result.data!.userId);

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

    return commentsRepositories.createComment(newComment);
  },

  async updateComment(
    idComment: string,
    dto: commentInput,
    header: string,
  ): Promise<Result<string | null>> {
    const result = await accessTokenGuard(header);

    if (result.status !== ResultStatus.Success) {
      return {
        status: ResultStatus.Unauthorized,
        data: null,
        errorMessage: "Unauthorized",
        extensions: [],
      };
    }

    const userId = result.data?.userId;

    if (!userId) {
      return {
        status: ResultStatus.Unauthorized,
        data: null,
        errorMessage: "User not found",
        extensions: [
          { field: "user", message: "User with the given ID does not exist" },
        ],
      };
    }

    const comment = await commentsRepositories.findCommentsById(idComment);

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

    return await commentsRepositories.updateComment(idComment, updatedComment);
  },
  async deleteComment(idComment: string, header: string) {
    const result = await accessTokenGuard(header);
    if (result.status !== ResultStatus.Success) {
      return {
        status: ResultStatus.Unauthorized,
        data: null,
        errorMessage: "Unauthorized",
        extensions: [],
      };
    }

    const userId = result.data?.userId;

    if (!userId) {
      return {
        status: ResultStatus.Unauthorized,
        data: null,
        errorMessage: "User not found",
        extensions: [
          { field: "user", message: "User with the given ID does not exist" },
        ],
      };
    }

    const comment = await commentsRepositories.findCommentsById(idComment);

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
    return commentsRepositories.deleteComment(idComment);
  },
};
