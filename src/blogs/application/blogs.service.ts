import { Blog } from "../types/blog";
import { blogsRepositories } from "../repositories/blogs.repository";
import {BlogInput} from "../dto/blog.input-dto";

export const blogsService = {
  async createBlog(dto: Blog) {
    const newBlog: Blog = {
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: false,
    };
    return blogsRepositories.createBlog(newBlog);
  },

  async updateBlog(id: string, blogInput: BlogInput, blog: Blog) {
    const dto: Blog = {
      ...blog,
      name: blogInput.name,
      description: blogInput.description,
      websiteUrl: blogInput.websiteUrl,
      createdAt: blog.createdAt,
      isMembership: blog.isMembership,
    };
    await blogsRepositories.updateBlog(id, dto);
  },
  async deleteBlog(id: string) {
    await blogsRepositories.deleteBlog(id);
  },
};
