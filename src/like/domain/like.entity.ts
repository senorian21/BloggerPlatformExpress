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

export type likeDocument = HydratedDocument<LikeComment>;

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
