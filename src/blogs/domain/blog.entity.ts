import mongoose, {HydratedDocument} from "mongoose";

export type Blog = {
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: Date;
  isMembership: boolean;
  deletedAt: Date;
};

export type BlogDocument = HydratedDocument<Blog>

const blogSchema = new mongoose.Schema<Blog>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  websiteUrl: { type: String, required: true },
  createdAt: { type: Date, required: true },
  isMembership: { type: Boolean, required: true },
  deletedAt: { type: Date, default: null },
});

export const BlogModel = mongoose.model("blogs", blogSchema);
