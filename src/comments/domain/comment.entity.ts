import mongoose, { HydratedDocument, model, Model } from "mongoose";
import { commentInput } from "../dto/comment.input-dto";
import { likeStatus } from "../../like/domain/like.entity";

export type commentatorInfo = {
  userId: string;
  userLogin: string;
};

export class CommentEntity {
  constructor(
    public postId: string,
    public content: string,
    public commentatorInfo: commentatorInfo,
    public createdAt: Date,
    public deletedAt: Date,
    public likeCount: number,
    public dislikeCount: number,
  ) {}
  static createComment(
    dto: commentInput,
    postId: string,
    userId: string,
    userLogin: string,
  ) {
    const newComment = new CommentModel();
    newComment.postId = postId;
    newComment.content = dto.content;
    newComment.commentatorInfo = {
      userId: userId,
      userLogin: userLogin,
    };
    newComment.createdAt = new Date();
    return newComment;
  }
  updateComment(dto: commentInput) {
    this.content = dto.content;
  }
  softDeletedComment() {
    this.deletedAt = new Date();
  }
  setLikeStatus(newStatus: likeStatus, previousStatus: likeStatus): void {
    if (previousStatus === likeStatus.Like) {
      this.likeCount -= 1;
    } else if (previousStatus === likeStatus.Dislike) {
      this.dislikeCount -= 1;
    }

    if (newStatus === likeStatus.Like) {
      this.likeCount += 1;
    } else if (newStatus === likeStatus.Dislike) {
      this.dislikeCount += 1;
    }
  }
}
interface commentMethods {
  updateComment(dto: commentInput): void;
  softDeletedComment(): void;
  setLikeStatus(newStatus: likeStatus, previousStatus: likeStatus): void;
}

type commentStatic = typeof CommentEntity;

type commentModelType = Model<CommentEntity, {}, commentMethods> &
  commentStatic;

export type commentDocument = HydratedDocument<CommentEntity, commentMethods>;

const commentatorInfoShema = new mongoose.Schema<commentatorInfo>({
  userId: { type: String, required: true },
  userLogin: { type: String, required: true },
});

const commentSchema = new mongoose.Schema<CommentEntity>({
  postId: { type: String, required: true },
  content: { type: String, required: true },
  commentatorInfo: { type: commentatorInfoShema, required: true },
  createdAt: { type: Date, required: true },
  deletedAt: { type: Date, default: null },
  likeCount: { type: Number, default: 0, required: true },
  dislikeCount: { type: Number, default: 0, required: true },
});

commentSchema.loadClass(CommentEntity);

export const CommentModel = model<CommentEntity, commentModelType>(
  "comment",
  commentSchema,
);
