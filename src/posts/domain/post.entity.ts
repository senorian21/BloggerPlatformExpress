import mongoose, { HydratedDocument } from "mongoose";
import { Blog } from "../../blogs/domain/blog.entity";

export type Post = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: Date;
  deletedAt: Date;
};
export type postDocument = HydratedDocument<Post>;
const postSchema = new mongoose.Schema<Post>({
  title: { type: String, required: true },
  shortDescription: { type: String, required: true },
  content: { type: String, required: true },
  blogId: { type: String, required: true },
  blogName: { type: String, required: true },
  createdAt: { type: Date, required: true },
  deletedAt: { type: Date, default: null },
});

export const PostModel = mongoose.model("post", postSchema);
