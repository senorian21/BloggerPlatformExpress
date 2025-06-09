import { ObjectId} from "mongodb";
import { injectable } from "inversify";
import {Post, PostModel} from "../domain/post.entity";

@injectable()
export class PostsRepository {
  async createPost(newPost: Post) {
    const result = await PostModel.insertOne(newPost);
    return result._id.toString();
  }

  async updatePost(id: string, dto: Post) {
    const updateResult = await PostModel.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          title: dto.title,
          shortDescription: dto.shortDescription,
          content: dto.content,
          blogId: dto.blogId,
          blogName: dto.blogName,
          createdAt: dto.createdAt,
        },
      },
    );
  }

  async deletePost(id: string) {
    const deleteResult = await PostModel.deleteOne({
      _id: new ObjectId(id),
    });
    if (deleteResult.deletedCount < 1) {
      throw new Error("Post not exist");
    }
  }
}
