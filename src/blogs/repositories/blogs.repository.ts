import { injectable } from "inversify";
import {BlogDocument, BlogModel} from "../domain/blog.entity";

@injectable()
export class BlogsRepositories {

  async save (blog: BlogDocument) {
    await blog.save();
  }

  async findById(id: string): Promise<BlogDocument | null> {
    return await BlogModel.findById(id);
  }

}
