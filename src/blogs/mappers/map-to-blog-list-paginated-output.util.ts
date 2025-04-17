import { WithId } from "mongodb";
import { Blog } from "../types/blog";
import { blogViewModel } from "../types/blog-view-model";

export function mapToBlogListPaginatedOutput(
  blogs: WithId<Blog>[],
  meta: { pageNumber: number; pageSize: number; totalCount: number },
): {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: blogViewModel[];
} {
  return {
    pagesCount: Math.ceil(meta.totalCount / meta.pageSize), // Переименовано из pageCount
    page: meta.pageNumber,
    pageSize: meta.pageSize,
    totalCount: meta.totalCount,
    items: blogs.map((blog) => ({
      id: blog._id.toString(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt,
      isMembership: blog.isMembership,
    })),
  };
}
