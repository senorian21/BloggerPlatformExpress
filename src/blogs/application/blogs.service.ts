import { Blog } from "../types/blog";
import { WithId } from "mongodb";
import { blogsRepositories } from "../repositories/blogs.repository";

export const blogsService = {
  async findMany(): Promise<WithId<Blog>[]> {
    return blogsRepositories.findAllBlogs();
  },
  async findById(id: string): Promise<WithId<Blog> | null> {
    return blogsRepositories.findById(id);
  },

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
