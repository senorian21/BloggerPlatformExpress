import { Post } from "../../posts/types/post";
import { ObjectId, WithId } from "mongodb";
import { postsRepository } from "../repositories/posts.repository";
import { PostInput } from "../dto/post.input-dto";
import { blogsService } from "../../blogs/application/blogs.service";
import { PostQueryInput } from "../types/post-query.input";
import { blogsQueryRepositories } from "../../blogs/repositories/blogs.queryRepository";
import {postsQueryRepository} from "../repositories/posts.queryRepository";

export const postsService = {


  async createPost(dto: PostInput) {
    const blogId = dto.blogId;

    const blog = await blogsQueryRepositories.findById(blogId);
    if (!blog) {
      return null;
    }

    const newPost: Post = {
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: blog.id.toString(),
      blogName: blog.name,
      createdAt: new Date().toISOString(),
    };

    return postsRepository.createPost(newPost);
  },

  async updatePost(id: string, dto: Post) {
    const blog = await blogsQueryRepositories.findById(dto.blogId);
    if (!blog) {
      return null;
    }

    const existingPost = await postsQueryRepository.findPostById(id);
    if (!existingPost) {
      return null;
    }

    const postUpdated: Post = {
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: dto.blogId,
      blogName: blog.name,
      createdAt: existingPost.createdAt,
    };

    await postsRepository.updatePost(id, postUpdated);
    return postUpdated
  },

  async deletePost(id: string) {
    await postsRepository.deletePost(id);
  },


};
