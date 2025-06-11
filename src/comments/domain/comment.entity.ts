import mongoose, { HydratedDocument } from "mongoose";

export type commentatorInfo = {
  userId: string;
  userLogin: string;
};

export type comment = {
  postId: string;
  content: string;
  commentatorInfo: commentatorInfo;
  createdAt: Date;
  deletedAt: Date;
};

export type commentDocument = HydratedDocument<comment>;

const commentatorInfoShema = new mongoose.Schema<commentatorInfo>({
  userId: { type: String, required: true },
  userLogin: { type: String, required: true },
});

const commentSchema = new mongoose.Schema<comment>({
  postId: { type: String, required: true },
  content: { type: String, required: true },
  commentatorInfo: { type: commentatorInfoShema, required: true },
  createdAt: { type: Date, required: true },
  deletedAt: { type: Date, default: null },
});

export const CommentModel = mongoose.model("comment", commentSchema);
