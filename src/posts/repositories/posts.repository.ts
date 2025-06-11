import { injectable } from "inversify";
import { Post, PostModel } from "../domain/post.entity";

@injectable()
export class PostsRepository {
  async createPost(newPost: Post) {
    const postInstance = new PostModel(newPost);
    await postInstance.save();
    return postInstance._id.toString();
  }

  async updatePost(id: string, dto: Post) {
    const postInstance = await PostModel.findOne({_id: id});
    if (!postInstance) {
      return false;
    }
    postInstance.title = dto.title;
    postInstance.shortDescription = dto.shortDescription;
    postInstance.content = dto.content;
    postInstance.blogId = dto.blogId;
    postInstance.blogName = dto.blogName;
    postInstance.createdAt = dto.createdAt;
    await postInstance.save()
    return true
  }

  async deletePost(id: string) {
    const result = await PostModel.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }
}
