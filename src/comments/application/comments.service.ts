import { commentInput } from "../dto/comment.input-dto";
import { jwtService } from "../../auth/adapters/jwt.service";
import { ResultStatus } from "../../core/result/resultCode";
import { userQueryRepository } from "../../users/repositories/users.queryRepository";
import { comment } from "../types/comment";
import { commentsRepositories } from "../repositories/comments.Repository";
import { Result } from "../../core/result/result.type";

export async function accessTokenGuard(header: string ) {

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

  const [authType, token] = header.split(" ");

  if (authType !== "Bearer") {
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

  if (!token) {
    return {
      status: ResultStatus.Unauthorized,
      data: null,
      errorMessage: "Token is missing",
      extensions: [
        { field: "token", message: "Token is required" },
      ],
    };
  }

  const payload = await jwtService.verifyToken(token);
  if (!payload) {
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

  const { userId } = payload;

  return {
    status: ResultStatus.Success,
    data: { userId },
    extensions: [],
  };
}

export const commentsService = {
  async createComment(
    dto: commentInput,
    header: any,
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
};
