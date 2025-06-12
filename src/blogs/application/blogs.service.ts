import { BlogsRepositories } from "../repositories/blogs.repository";
import { BlogInput } from "../dto/blog.input-dto";
import { injectable } from "inversify";
import { Blog, BlogModel } from "../domain/blog.entity";

@injectable()
export class BlogsService {
  constructor(public blogsRepositories: BlogsRepositories) {}
  async createBlog(dto: Blog) {
    const blog = new BlogModel();
    blog.name = dto.name;
    blog.description = dto.description;
    blog.websiteUrl = dto.websiteUrl;
    blog.createdAt = new Date();
    blog.isMembership = false;

    await this.blogsRepositories.save(blog);
    return blog._id.toString();
  }

  async updateBlog(id: string, blogInput: BlogInput) {
    const blog = await this.blogsRepositories.findById(id);
    if (!blog) {
      return null;
    }
    blog.name = blogInput.name;
    blog.description = blogInput.description;
    blog.websiteUrl = blogInput.websiteUrl;
    await this.blogsRepositories.save(blog);
    return true;
  }

  async deleteBlog(id: string) {
    const blog = await this.blogsRepositories.findById(id);
    if (!blog) {
      return false;
    }
    blog.deletedAt = new Date();
    await this.blogsRepositories.save(blog);
    return true;
  }
}
