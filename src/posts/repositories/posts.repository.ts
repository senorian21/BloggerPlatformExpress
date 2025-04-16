import { Post } from "../../posts/types/post";
import { ObjectId, WithId } from "mongodb";
import { postCollection } from "../../db/mongo.db";

export const postsRepository = {
  async findAllPosts(): Promise<WithId<Post>[]> {
    return postCollection.find().toArray();
  },

  async findPostById(id: string) {
    return postCollection.findOne({ _id: new ObjectId(id) });
  },

  async createPost(newPost: Post) {
    const result = await postCollection.insertOne(newPost);
    return { ...newPost, _id: result.insertedId };
  },

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
  },

  async deletePost(id: string) {
    const deleteResult = await postCollection.deleteOne({
      _id: new ObjectId(id),
    });
    if (deleteResult.deletedCount < 1) {
      throw new Error("Blog not exist");
    }
  },

  async findAllPostsByBlogId(postId: string) {
    return await postCollection.find({ blogId: postId }).toArray();
  },
};
