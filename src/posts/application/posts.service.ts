import { PostsRepository } from "../repositories/posts.repository";
import { PostInput } from "../dto/post.input-dto";
import { BlogsQueryRepositories } from "../../blogs/repositories/blogs.queryRepository";
import { injectable } from "inversify";
import { PostEntity, PostModel } from "../domain/post.entity";
import { LikePostModel, likeStatus } from "../../like/domain/like.entity";
import { ResultStatus } from "../../core/result/resultCode";
import { UserRepository } from "../../users/repositories/users.repository";

@injectable()
export class PostsService {
  constructor(
    public postsRepository: PostsRepository,
    public blogsQueryRepositories: BlogsQueryRepositories,
    public userRepository: UserRepository,
  ) {}

  async createPost(dto: PostInput) {
    const blogId = dto.blogId;
    const blog = await this.blogsQueryRepositories.findById(blogId);
    if (!blog) {
      return null;
    }
    const newPost = PostModel.createPost(dto, blog.name);

    await this.postsRepository.save(newPost);
    return newPost._id.toString();
  }

  async updatePost(id: string, dto: PostEntity) {
    const blog = await this.blogsQueryRepositories.findById(dto.blogId);
    if (!blog) {
      return false;
    }

    const existingPost = await this.postsRepository.findById(id);
    if (!existingPost) {
      return false;
    }

    existingPost.updatePost(dto, blog.name);

    await this.postsRepository.save(existingPost);
    return true;
  }

  async deletePost(id: string) {
    const post = await this.postsRepository.findById(id);
    if (!post) {
      return false;
    }
    post.deletePost();
    await this.postsRepository.save(post);
    return true;
  }

  async likePost(idPost: string, userId: string, likeStatusReq: likeStatus) {
    const post = await this.postsRepository.findById(idPost);
    if (!post) {
      return {
        status: ResultStatus.NotFound,
        data: null,
        errorMessage: "post not found",
        extensions: [{ field: "post", message: "No such post was found." }],
      };
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      return {
        status: ResultStatus.NotFound,
        data: null,
        errorMessage: "user not found",
        extensions: [{ field: "user", message: "No such user was found." }],
      };
    }

    let like = await this.postsRepository.findLikeByIdUser(userId, idPost);
    const previousStatus = like?.status || likeStatus.None;

    if (!like) {
      const newLike = new LikePostModel();
      newLike.userId = user.id;
      newLike.status = likeStatusReq;
      newLike.postId = post.id;
      newLike.createdAt = new Date();
      await this.postsRepository.saveLike(newLike);

      post.setLikeStatus(user.id, user.login, likeStatusReq, previousStatus);
    } else {
      like.status = likeStatusReq;
      await this.postsRepository.saveLike(like);

      post.setLikeStatus(user.id, user.login, likeStatusReq, previousStatus);
    }

    await this.postsRepository.save(post);

    return {
      status: ResultStatus.Success,
      data: null,
      extensions: [],
    };
  }
}
