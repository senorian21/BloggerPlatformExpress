import { Blog } from "../types/blog";
import { db } from "../../db/in-memory.db";
import { BlogInput } from "../dto/blog.input-dto";

export const blogsRepositories = {
  findAllBlogs(): Blog[] {
    return db.blogs;
  },
  findById(id: string) {
    return db.blogs.find((b) => b.id === id);
  },
  createBlog(newBlog: Blog) {
    db.blogs.push(newBlog);
    return newBlog;
  },
  updateBlog(id: string, dto: BlogInput) {
    const indexBlog = db.blogs.findIndex((b) => b.id === id);

    if (indexBlog === -1) {
    }

    const updateBlog = {
      ...db.blogs[indexBlog],
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
    };
    db.blogs[indexBlog] = updateBlog;
  },
  deleteBlog(id: string) {
    const indexBlog = db.blogs.findIndex((b) => b.id === id);
    db.blogs.splice(indexBlog, 1);
  },
};
