import { Post } from "../../posts/types/post";
import { WithId } from "mongodb";
import { postsRepository } from "../repositories/posts.repository";
import { PostInput } from "../dto/post.input-dto";
import { blogsService } from "../../blogs/application/blogs.service";
import { PostQueryInput } from "../types/post-query.input";

export const postsService = {
  async findAllPosts(
    queryDto: PostQueryInput,
  ): Promise<{ items: WithId<Post>[]; totalCount: number }> {
    return postsRepository.findAllPosts(queryDto);
  },

  async findPostById(id: string) {
    return postsRepository.findPostById(id);
  },

  async createPost(dto: PostInput) {
    const blogId = dto.blogId;

    const blog = await blogsService.findById(blogId);
    if (!blog) {
      return;
    }

    const newPost: Post = {
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: blog._id.toString(),
      blogName: blog.name,
      createdAt: new Date().toISOString(),
    };

    return postsRepository.createPost(newPost);
  },

  async updatePost(id: string, dto: Post) {
    await postsRepository.updatePost(id, dto);
  },

  async deletePost(id: string) {
    await postsRepository.deletePost(id);
  },

  async findAllPostsByBlogId(blogId: string) {
    return postsRepository.findAllPostsByBlogId(blogId);
  },
};
