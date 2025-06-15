import mongoose, { HydratedDocument } from "mongoose";

export enum likeStatus {
  None = "None",
  Like = "Like",
  Dislike = "Dislike",
}

export type LikeComment = {
  createdAt: Date;
  status: likeStatus;
  userId: string;
  commentId: string;
};

export type LikePost = {
  createdAt: Date;
  status: likeStatus;
  userId: string;
  postId: string;
};

export type likeCommentsDocument = HydratedDocument<LikeComment>;

const likeCommentSchema = new mongoose.Schema<LikeComment>({
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

export const LikeCommentModel = mongoose.model<LikeComment>(
  "LikeComment",
  likeCommentSchema,
);

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
