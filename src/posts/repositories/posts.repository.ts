import { injectable } from "inversify";
import { Post, postDocument, PostModel } from "../domain/post.entity";

@injectable()
export class PostsRepository {
  async save(post: postDocument) {
    await post.save();
  }

  async findById(id: string) {
    const post = await PostModel.findById(id);
    if (!post || post.deletedAt !== null) {
      return null;
    }
    return post;
  }
}
