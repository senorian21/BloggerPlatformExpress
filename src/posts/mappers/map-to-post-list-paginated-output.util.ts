import { WithId } from "mongodb";
import { Post } from "../domain/post.entity";
import { PostViewModel } from "../types/post-view-model";

export function mapToPostListPaginatedOutput(
  posts: WithId<Post>[],
  myStatusArray: string[],
  meta: { pageNumber: number; pageSize: number; totalCount: number },
): {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: PostViewModel[];
} {
  const { pageNumber, pageSize, totalCount } = meta;

  const items = posts.map((post, index) => {
    const myStatus = myStatusArray[index];

    const rawNewest = post.newestLikes ?? [];
    const sortedNewest = [...rawNewest].sort(
      (a, b) => b.addedAt.getTime() - a.addedAt.getTime(),
    );
    const limitedNewest = sortedNewest.slice(0, 3);

    const formattedNewest = limitedNewest.map((like) => ({
      addedAt: like.addedAt.toISOString(),
      userId: like.userId,
      login: like.login,
    }));

    return {
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt.toISOString(),
      extendedLikesInfo: {
        likesCount: post.likeCount,
        dislikesCount: post.dislikeCount,
        myStatus,
        newestLikes: formattedNewest,
      },
    };
  });

  return {
    pagesCount: Math.ceil(totalCount / pageSize),
    page: pageNumber,
    pageSize,
    totalCount,
    items,
  };
}
