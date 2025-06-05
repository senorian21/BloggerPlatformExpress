import { Post } from "../../posts/types/post";
import { PostsRepository } from "../repositories/posts.repository";
import { PostInput } from "../dto/post.input-dto";
import { BlogsQueryRepositories } from "../../blogs/repositories/blogs.queryRepository";
import { PostsQueryRepository } from "../repositories/posts.queryRepository";

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

    const newPost: Post = {
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: blog.id.toString(),
      blogName: blog.name,
      createdAt: new Date().toISOString(),
    };

    return this.postsRepository.createPost(newPost);
  }

  async updatePost(id: string, dto: Post) {
    const blog = await this.blogsQueryRepositories.findById(dto.blogId);
    if (!blog) {
      return null;
    }

    const existingPost = await this.postsQueryRepository.findPostById(id);
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

    await this.postsRepository.updatePost(id, postUpdated);
    return postUpdated;
  }

  async deletePost(id: string) {
    await this.postsRepository.deletePost(id);
  }
}
