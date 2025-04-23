import { Blog } from "../types/blog";
import { blogsRepositories } from "../repositories/blogs.repository";

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

  async updateBlog(id: string, dto: Blog) {
    await blogsRepositories.updateBlog(id, dto);
  },
  async deleteBlog(id: string) {
    await blogsRepositories.deleteBlog(id);
  },
};
