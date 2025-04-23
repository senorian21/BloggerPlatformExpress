import { Blog } from "../types/blog";
import { blogCollection } from "../../db/mongo.db";
import { ObjectId, WithId } from "mongodb";
import { BlogsQueryInput } from "../types/blog-query.input";

export const blogsRepositories = {



  async createBlog(newBlog: Blog) {
    const result = await blogCollection.insertOne(newBlog);
    return { ...newBlog, _id: result.insertedId };
  },

  async updateBlog(id: string, dto: Blog) {
    const updateResult = await blogCollection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          name: dto.name,
          description: dto.description,
          websiteUrl: dto.websiteUrl,
          createdAt: dto.createdAt,
          isMembership: dto.isMembership,
        },
      },
    );
  },
  async deleteBlog(id: string) {
    const deleteResult = await blogCollection.deleteOne({
      _id: new ObjectId(id),
    });
    if (deleteResult.deletedCount < 1) {
      throw new Error("Blog not exist");
    }
  },
};
