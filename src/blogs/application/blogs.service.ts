import { BlogsRepositories } from "../repositories/blogs.repository";
import { BlogInput } from "../dto/blog.input-dto";
import { injectable } from "inversify";
import { BlogEntity, BlogModel } from "../domain/blog.entity";

@injectable()
export class BlogsService {
  constructor(public blogsRepositories: BlogsRepositories) {}
  async createBlog(dto: BlogEntity) {
    const blog = BlogModel.createBlog(dto);
    await this.blogsRepositories.save(blog);
    return blog._id.toString();
  }

  async updateBlog(id: string, blogInput: BlogInput) {
    const blog = await this.blogsRepositories.findById(id);
    if (!blog) {
      return null;
    }
    blog.updateBlog(blogInput);
    await this.blogsRepositories.save(blog);
    return true;
  }

  async deleteBlog(id: string) {
    const blog = await this.blogsRepositories.findById(id);
    if (!blog) {
      return false;
    }
    blog.softDeleteBlog();
    await this.blogsRepositories.save(blog);
    return true;
  }
}
