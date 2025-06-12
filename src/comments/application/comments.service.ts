import { commentInput } from "../dto/comment.input-dto";
import { ResultStatus } from "../../core/result/resultCode";
import { UserQueryRepository } from "../../users/repositories/users.queryRepository";
import { CommentsRepositories } from "../repositories/comments.Repository";
import { Result } from "../../core/result/result.type";
import { injectable } from "inversify";
import { CommentModel } from "../domain/comment.entity";
import { PostsQueryRepository } from "../../posts/repositories/posts.queryRepository";
import { LikeCommentModel, likeStatus } from "../../like/domain/like.entity";
import { UserRepository } from "../../users/repositories/users.repository";

@injectable()
export class CommentsService {
  constructor(
    public userQueryRepository: UserQueryRepository,
    public commentsRepositories: CommentsRepositories,
    public postsRepositories: PostsQueryRepository,
    public userRepository: UserRepository,
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

    const post = await this.postsRepositories.findPostById(postId);
    if (!post) {
      return {
        status: ResultStatus.NotFound,
        data: null,
        errorMessage: "Post not found",
        extensions: [
          { field: "post", message: "Post with the given ID does not exist" },
        ],
      };
    }

    const newComment = new CommentModel();
    newComment.postId = post.id; // Используем _id вместо id
    newComment.content = dto.content;
    newComment.commentatorInfo = {
      userId: user.id,
      userLogin: user.login,
    };
    newComment.createdAt = new Date();

    await this.commentsRepositories.save(newComment);
    return {
      status: ResultStatus.Success,
      data: newComment._id.toString(),
      extensions: [],
    };
  }

  async updateComment(
    idComment: string,
    dto: commentInput,
    userId: string,
  ): Promise<Result<string | null>> {
    const comment = await this.commentsRepositories.findById(idComment);

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
    comment.content = dto.content;
    await this.commentsRepositories.save(comment);
    return {
      status: ResultStatus.Success,
      data: null,
      extensions: [],
    };
  }

  async deleteComment(idComment: string, userId: string) {
    const comment = await this.commentsRepositories.findById(idComment);
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
    comment.deletedAt = new Date();
    await this.commentsRepositories.save(comment);
    return {
      status: ResultStatus.Success,
      data: null,
      extensions: [],
    };
  }

  async likeComments(
    idComment: string,
    userId: string,
    likeStatusReq: likeStatus,
  ) {
    const comment = await this.commentsRepositories.findById(idComment);
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

    const user = await this.userRepository.findById(userId);
    if (!user) {
      return {
        status: ResultStatus.NotFound,
        data: null,
        errorMessage: "User not found",
        extensions: [{ field: "User", message: "No such user was found." }],
      };
    }

    let like = await this.commentsRepositories.findLikeByidUser(
      userId,
      idComment,
    );

    if (!like) {
      like = new LikeCommentModel();
      like.commentId = comment.id;
      like.userId = user.id;
      like.status = likeStatusReq;
      like.createdAt = new Date();

      await this.commentsRepositories.saveLike(like);

      if (likeStatusReq === likeStatus.Like) {
        comment.likeCount += 1;
      } else if (likeStatusReq === likeStatus.Dislike) {
        comment.dislikeCount += 1;
      }

      await this.commentsRepositories.save(comment);
    } else {
      const prevStatus = like.status;

      like.status = likeStatusReq;
      await this.commentsRepositories.saveLike(like);

      if (prevStatus === likeStatus.Like) {
        comment.likeCount -= 1;
      } else if (prevStatus === likeStatus.Dislike) {
        comment.dislikeCount -= 1;
      }

      if (likeStatusReq === likeStatus.Like) {
        comment.likeCount += 1;
      } else if (likeStatusReq === likeStatus.Dislike) {
        comment.dislikeCount += 1;
      }

      await this.commentsRepositories.save(comment);
    }
    return {
      status: ResultStatus.Success,
      data: null,
      extensions: [],
    };
  }
}
