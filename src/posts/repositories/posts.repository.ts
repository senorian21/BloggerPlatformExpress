import { injectable } from "inversify";
import { postDocument, PostModel } from "../domain/post.entity";
import {
  LikePostModel,
  likePostsDocument,
} from "../../like/domain/like.entity";

@injectable()
export class PostsRepository {
  async save(post: postDocument) {
    await post.save();
  }

  async findById(id: string): Promise<postDocument | null> {
    const post = await PostModel.findById(id);
    if (!post || post.deletedAt !== null) {
      return null;
    }
    return post;
  }

  async findLikeByIdUser(
    userId: string,
    postId: string | string[],
  ): Promise<likePostsDocument | null> {
    return LikePostModel.findOne({ userId, postId });
  }

  async saveLike(like: likePostsDocument) {
    await like.save();
  }
}
