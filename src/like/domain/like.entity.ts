import mongoose, { HydratedDocument, model, Model } from "mongoose";

export enum likeStatus {
  None = "None",
  Like = "Like",
  Dislike = "Dislike",
}

export class LikeCommentEntity {
  constructor(
    public createdAt: Date,
    public status: likeStatus,
    public userId: string,
    public commentId: string,
  ) {}
  static createLikeComment(
    commentId: string,
    userId: string,
    likeStatusReq: likeStatus,
  ) {
    const like = new LikeCommentModel();
    like.commentId = commentId;
    like.userId = userId;
    like.status = likeStatusReq;
    like.createdAt = new Date();
    return like;
  }
  updateLikeComment(likeStatusReq: likeStatus) {
    this.status = likeStatusReq;
  }
}
interface LikeCommentMethods {
  updateLikeComment(likeStatusReq: likeStatus): void;
}

type LikeCommentStatic = typeof LikeCommentEntity;

type LikeCommentModelType = Model<LikeCommentEntity, {}, LikeCommentMethods> &
  LikeCommentStatic;

export type likeCommentsDocument = HydratedDocument<
  LikeCommentEntity,
  LikeCommentMethods
>;

const likeCommentSchema = new mongoose.Schema<LikeCommentEntity>({
  createdAt: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(likeStatus),
    default: likeStatus.None,
  },
  userId: {
    type: String,
    required: true,
  },
  commentId: {
    type: String,
    required: true,
  },
});

likeCommentSchema.loadClass(LikeCommentEntity);

export const LikeCommentModel: LikeCommentModelType = model<
  LikeCommentEntity,
  LikeCommentModelType
>("LikeComment", likeCommentSchema);

export type LikePost = {
  createdAt: Date;
  status: likeStatus;
  userId: string;
  postId: string;
};

export type likePostsDocument = HydratedDocument<LikePost>;

const likePostsSchema = new mongoose.Schema<LikePost>({
  createdAt: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(likeStatus),
    default: likeStatus.None,
  },
  userId: {
    type: String,
    required: true,
  },
  postId: {
    type: String,
    required: true,
  },
});

export const LikePostModel = mongoose.model<LikePost>(
  "LikePost",
  likePostsSchema,
);
