import mongoose, { HydratedDocument } from "mongoose";

export type newestLikes = {
  addedAt: Date;
  userId: string;
  login: string;
};

export type Post = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: Date;
  deletedAt: Date | null;
  likeCount: number;
  dislikeCount: number;
  newestLikes: newestLikes[];
};

export type newestLikesDocument = HydratedDocument<newestLikes>;

export type postDocument = HydratedDocument<Post>;

const newestLikesShema = new mongoose.Schema<newestLikes>({
  addedAt: { type: Date, required: true },
  userId: { type: String, required: true },
  login: { type: String, required: true },
});

const postSchema = new mongoose.Schema<Post>({
  title: { type: String, required: true },
  shortDescription: { type: String, required: true },
  content: { type: String, required: true },
  blogId: { type: String, required: true },
  blogName: { type: String, required: true },
  createdAt: { type: Date, required: true },
  deletedAt: { type: Date, default: null },
  likeCount: { type: Number, default: 0, required: true },
  dislikeCount: { type: Number, default: 0, required: true },
  newestLikes: {
    type: [newestLikesShema],
    required: true,
  },
});

export const PostModel = mongoose.model("Post", postSchema);
