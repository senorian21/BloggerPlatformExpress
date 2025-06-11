import { ObjectId } from "mongodb";
import { injectable } from "inversify";
import { Blog, BlogModel } from "../domain/blog.entity";

@injectable()
export class BlogsRepositories {

  async createBlog(newBlog: Blog) {
    const blogInstance = new BlogModel(newBlog)
    await blogInstance.save();
    return blogInstance._id.toString();
  }

  async updateBlog(id: string, dto: Blog) {
    const blogInstance = await BlogModel.findOne({_id: id})
    if (!blogInstance) {
      return false
    }
    blogInstance.name = dto.name;
    blogInstance.description = dto.description;
    blogInstance.websiteUrl = dto.websiteUrl;
    blogInstance.createdAt = dto.createdAt;
    blogInstance.isMembership = dto.isMembership;

    await blogInstance.save()
  }
  async deleteBlog(id: string): Promise<boolean> {
    const result = await BlogModel.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }

}
