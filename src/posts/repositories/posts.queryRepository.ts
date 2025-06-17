import { ObjectId } from "mongodb";
import { PostQueryInput } from "../types/post-query.input";
import { mapToPostViewModel } from "../mappers/map-to-post-view-model.util";
import { mapToPostListPaginatedOutput } from "../mappers/map-to-post-list-paginated-output.util";
import { injectable } from "inversify";
import { PostModel } from "../domain/post.entity";
import { likeStatus } from "../../like/domain/like.entity";
import { PostsRepository } from "./posts.repository";
import { PostViewModel } from "../types/post-view-model";

@injectable()
export class PostsQueryRepository {
  constructor(public postsRepository: PostsRepository) {}
  async findAllPosts(
    queryDto: PostQueryInput,
    blogId?: string,
    userId?: string,
  ): Promise<{ items: PostViewModel[]; totalCount: number }> {
    const { pageNumber, pageSize, sortBy, sortDirection } = queryDto;
    const skip = (pageNumber - 1) * pageSize;
    const filter: any = {
      deletedAt: null,
    };

    if (blogId) {
      filter.blogId = blogId;
    }
    const rawPosts = await PostModel.find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(+pageSize);

    const totalCount = await PostModel.countDocuments(filter);

    let myStatusArray = Array(rawPosts.length).fill(likeStatus.None);

    if (userId) {
      console.log("userId:", userId);
      console.log(
        "postIds:",
        rawPosts.map((p) => p._id.toString()),
      );

      myStatusArray = await Promise.all(
        rawPosts.map(async (post) => {
          const postId = post._id.toString();
          const userLike = await this.postsRepository.findLikeByIdUser(
            userId,
            postId,
          );
          console.log(`Like for ${postId} by ${userId}:`, userLike); // Логируем результат
          return userLike?.status ?? likeStatus.None;
        }),
      );
    }
    console.log(myStatusArray);

    return mapToPostListPaginatedOutput(rawPosts, myStatusArray, {
      pageNumber: +pageNumber,
      pageSize: +pageSize,
      totalCount,
    });
  }

  async findPostById(id: string, userId?: string | null) {
    if (!ObjectId.isValid(id)) {
      return null;
    }
    const post = await PostModel.findOne({ _id: new ObjectId(id) });
    if (!post) {
      return null;
    }
    let myStatus: likeStatus = likeStatus.None;
    if (userId) {
      const userLike = await this.postsRepository.findLikeByIdUser(userId, id);
      if (userLike) {
        myStatus = userLike.status;
      }
    }

    if (!post || post.deletedAt !== null) {
      return null;
    }
    return mapToPostViewModel(post, myStatus);
  }
}
