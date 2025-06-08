import { Post } from "../../posts/types/post";
import { ObjectId} from "mongodb";
import { postCollection } from "../../db/mongo.db";
import { injectable } from "inversify";

@injectable()
export class PostsRepository {
  async createPost(newPost: Post) {
    const result = await postCollection.insertOne(newPost);
    return result.insertedId.toString();
  }

  async updatePost(id: string, dto: Post) {
    const updateResult = await postCollection.updateOne(
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
    const deleteResult = await postCollection.deleteOne({
      _id: new ObjectId(id),
    });
    if (deleteResult.deletedCount < 1) {
      throw new Error("Post not exist");
    }
  }
}
