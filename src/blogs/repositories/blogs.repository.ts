import { ObjectId } from "mongodb";
import { injectable } from "inversify";
import { Blog, BlogModel } from "../domain/blog.entity";

@injectable()
export class BlogsRepositories {
  async createBlog(newBlog: Blog) {
    const result = await BlogModel.insertOne(newBlog);
    return result._id.toString();
  }

  async updateBlog(id: string, dto: Blog) {
    const updateResult = await BlogModel.updateOne(
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
  }
  async deleteBlog(id: string) {
    const deleteResult = await BlogModel.deleteOne({
      _id: new ObjectId(id),
    });
    if (deleteResult.deletedCount < 1) {
      throw new Error("Blog not exist");
    }
  }
}
