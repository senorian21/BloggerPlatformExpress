import { PostsRepository } from "../repositories/posts.repository";
import { PostInput } from "../dto/post.input-dto";
import { BlogsQueryRepositories } from "../../blogs/repositories/blogs.queryRepository";
import { PostsQueryRepository } from "../repositories/posts.queryRepository";
import { injectable } from "inversify";
import { newestLikes, Post, PostModel } from "../domain/post.entity";
import {
  LikeCommentModel,
  LikePostModel,
  likeStatus,
} from "../../like/domain/like.entity";
import { ResultStatus } from "../../core/result/resultCode";
import { UserRepository } from "../../users/repositories/users.repository";
import { CommentsRepositories } from "../../comments/repositories/comments.Repository";
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
    const newPost = new PostModel();
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
    existingPost.blogName = blog.name;

    await this.postsRepository.save(existingPost);
    return true;
  }

  async deletePost(id: string) {
    const post = await this.postsRepository.findById(id);
    if (!post) {
      return false;
    }
    post.deletedAt = new Date();
    await this.postsRepository.save(post);
    return true;
  }

  async likePost(idPost: string, userId: string, likeStatusReq: likeStatus) {
    const post = await this.postsRepository.findById(idPost);
    if (!post) {
      return {
        status: ResultStatus.NotFound,
        data: null,
        errorMessage: "Post not found",
        extensions: [{ field: "post", message: "No such post was found." }],
      };
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      return {
        status: ResultStatus.NotFound,
        data: null,
        errorMessage: "User not found",
        extensions: [{ field: "User", message: "No such user was found." }],
      };
    }

    const existingLikeIndex = post.newestLikes.findIndex(
      (entry) => entry.userId === userId,
    );

    let like = await this.postsRepository.findLikeByIdUser(userId, idPost);
    const updateNewestLikes = (likeEntry: newestLikes) => {
      if (existingLikeIndex > -1) {
        post.newestLikes.splice(existingLikeIndex, 1);
      }
      if (post.newestLikes.length >= 3) {
        post.newestLikes.pop();
      }
      if (likeEntry) {
        post.newestLikes.unshift(likeEntry);
      }
    };

    if (!like) {
      like = new LikePostModel();
      like.userId = user.id;
      like.status = likeStatusReq;
      like.postId = post.id;
      like.createdAt = new Date();

      await this.postsRepository.saveLike(like);

      if (likeStatusReq === likeStatus.Like) {
        post.likeCount += 1;
        updateNewestLikes({
          addedAt: new Date(),
          userId: user.id,
          login: user.login,
        });
      } else {
        post.dislikeCount += 1;
      }
    } else {
      const prevStatus = like.status;
      like.status = likeStatusReq;
      await this.postsRepository.saveLike(like);

      if (prevStatus === likeStatus.Like) {
        post.likeCount -= 1;
      } else {
        post.dislikeCount -= 1;
      }

      if (likeStatusReq === likeStatus.Like) {
        post.likeCount += 1;
        updateNewestLikes({
          addedAt: new Date(),
          userId: user.id,
          login: user.login,
        });
      } else {
        post.dislikeCount += 1;
        if (existingLikeIndex > -1) {
          post.newestLikes.splice(existingLikeIndex, 1);
        }
      }
    }

    await this.postsRepository.save(post);

    return {
      status: ResultStatus.Success,
      data: null,
      extensions: [],
    };
  }
}
