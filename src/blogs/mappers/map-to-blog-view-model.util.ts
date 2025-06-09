import { WithId } from "mongodb";
import { blogViewModel } from "../types/blog-view-model";
import { Blog } from "../domain/blog.entity";

export function mapToBlogViewModel(blog: WithId<Blog>): blogViewModel {
  return {
    id: blog._id.toString(),
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt,
    isMembership: blog.isMembership,
  };
}
