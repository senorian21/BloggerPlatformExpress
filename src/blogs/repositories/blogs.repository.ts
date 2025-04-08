import { Blog } from "../types/blog";
import { BlogInput } from "../dto/blog.input-dto";
import { blogCollection } from "../../db/mongo.db";
import { ObjectId, WithId } from "mongodb";

export const blogsRepositories = {
  async findAllBlogs(): Promise<WithId<Blog>[]> {
    return blogCollection.find().toArray();
  },
  async findById(id: string): Promise<WithId<Blog> | null> {
    return blogCollection.findOne({ _id: new ObjectId(id) });
  },

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
      throw new Error("Driver not exist");
    }
  },
};
