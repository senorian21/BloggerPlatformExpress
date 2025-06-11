import { PostsRepository } from "../repositories/posts.repository";
import { PostInput } from "../dto/post.input-dto";
import { BlogsQueryRepositories } from "../../blogs/repositories/blogs.queryRepository";
import { PostsQueryRepository } from "../repositories/posts.queryRepository";
import { injectable } from "inversify";
import {Post, PostModel} from "../domain/post.entity";
@injectable()
export class PostsService {
  constructor(
    public postsRepository: PostsRepository,
    public blogsQueryRepositories: BlogsQueryRepositories,
    public postsQueryRepository: PostsQueryRepository,
  ) {}

  async createPost(dto: PostInput) {
    const blogId = dto.blogId;
    const blog = await this.blogsQueryRepositories.findById(blogId);
    if (!blog) {
      return null;
    }
    const newPost = new PostModel()
    newPost.title = dto.title;
    newPost.content = dto.content;
    newPost.shortDescription = dto.shortDescription;
    newPost.blogId = dto.blogId;
    newPost.blogName = blog.name;
    newPost.createdAt = new Date();

    await this.postsRepository.save(newPost);
    return newPost._id.toString();
  }

  async updatePost(id: string, dto: Post) {
    const blog = await this.blogsQueryRepositories.findById(dto.blogId);
    if (!blog) {
      return false;
    }

    const existingPost = await this.postsRepository.findById(id);
    if (!existingPost) {
      return false;
    }
    existingPost.title = dto.title;
    existingPost.shortDescription = dto.shortDescription;
    existingPost.content = dto.content;
    existingPost.blogId = dto.blogId;
    existingPost.blogName = blog.name

    await this.postsRepository.save(existingPost);
    return true
  }

  async deletePost(id: string) {
    const post = await this.postsRepository.findById(id);
    if (!post) {
      return false;
    }
    post.deletedAt = new Date();
    await this.postsRepository.save(post);
    return true
  }
}
