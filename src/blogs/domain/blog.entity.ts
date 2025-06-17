import mongoose, { HydratedDocument, Model, model } from "mongoose";
import { BlogInput } from "../dto/blog.input-dto";

export class BlogEntity {
  constructor(
    public name: string,
    public description: string,
    public websiteUrl: string,
    public createdAt: Date,
    public isMembership: boolean,
    public deletedAt: Date,
  ) {}
  static createBlog(dto: BlogEntity) {
    const blog = new BlogModel();
    blog.name = dto.name;
    blog.description = dto.description;
    blog.websiteUrl = dto.websiteUrl;
    blog.createdAt = new Date();
    blog.isMembership = false;
    return blog;
  }
  updateBlog(dto: BlogInput) {
    this.name = dto.name;
    this.description = dto.description;
    this.websiteUrl = dto.websiteUrl;
  }
  softDeleteBlog() {
    this.deletedAt = new Date();
  }
}

interface BlogMethods {
  updateBlog(dto: BlogInput): void;
  softDeleteBlog(): void;
}

type BlogStatic = typeof BlogEntity;
type BlogModelType = Model<BlogEntity, {}, BlogMethods> & BlogStatic;

export type BlogDocument = HydratedDocument<BlogEntity, BlogMethods>;

const blogSchema = new mongoose.Schema<BlogEntity, BlogModelType, BlogMethods>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  websiteUrl: { type: String, required: true },
  createdAt: { type: Date, required: true },
  isMembership: { type: Boolean, required: true },
  deletedAt: { type: Date, default: null },
});

blogSchema.loadClass(BlogEntity);

export const BlogModel = model<BlogEntity, BlogModelType>("blogs", blogSchema);
