import { Blog } from "../types/blog";
import { BlogsRepositories } from "../repositories/blogs.repository";
import { BlogInput } from "../dto/blog.input-dto";
import { injectable } from "inversify";
@injectable()
export class BlogsService {
  constructor(public blogsRepositories: BlogsRepositories) {}
  async createBlog(dto: Blog) {
    const newBlog: Blog = {
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: false,
    };
    return this.blogsRepositories.createBlog(newBlog);
  }

  async updateBlog(id: string, blogInput: BlogInput, blog: Blog) {
    const dto: Blog = {
      ...blog,
      name: blogInput.name,
      description: blogInput.description,
      websiteUrl: blogInput.websiteUrl,
      createdAt: blog.createdAt,
      isMembership: blog.isMembership,
    };
    await this.blogsRepositories.updateBlog(id, dto);
  }
  async deleteBlog(id: string) {
    await this.blogsRepositories.deleteBlog(id);
  }
}
