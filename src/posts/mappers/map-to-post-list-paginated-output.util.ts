import { WithId } from "mongodb";

import { Post } from "../types/post";
import { postViewModel } from "../types/post-view-model";

export function mapToPostListPaginatedOutput(
  post: WithId<Post>[],
  meta: { pageNumber: number; pageSize: number; totalCount: number },
): {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: postViewModel[];
} {
  return {
    pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
    page: meta.pageNumber,
    pageSize: meta.pageSize,
    totalCount: meta.totalCount,
    items: post.map((post) => ({
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,
    })),
  };
}
