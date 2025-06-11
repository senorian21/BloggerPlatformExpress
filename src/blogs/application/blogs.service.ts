import { BlogsRepositories } from "../repositories/blogs.repository";
import { BlogInput } from "../dto/blog.input-dto";
import { injectable } from "inversify";
import { Blog } from "../domain/blog.entity";

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
    const updateBlog = await this.blogsRepositories.updateBlog(id, dto);
    if (!updateBlog) {
      return false
    }
  }
  async deleteBlog(id: string): Promise<boolean> {
    return this.blogsRepositories.deleteBlog(id);
  }
}
