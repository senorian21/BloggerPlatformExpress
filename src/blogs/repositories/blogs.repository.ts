import { injectable } from "inversify";
import { BlogDocument, BlogModel } from "../domain/blog.entity";

@injectable()
export class BlogsRepositories {
  async save(blog: BlogDocument) {
    await blog.save();
  }

  async findById(id: string): Promise<BlogDocument | null> {
    const blog = await BlogModel.findById(id);
    if (!blog || blog.deletedAt !== null) {
      return null;
    }
    return blog;
  }
}
