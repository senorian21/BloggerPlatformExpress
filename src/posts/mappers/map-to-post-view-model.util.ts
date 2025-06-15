import { WithId } from "mongodb";

import { Post } from "../domain/post.entity";
import {
  ExtendedLikesInfoViewModel,
  LikeInfoViewModel,
  PostViewModel,
} from "../types/post-view-model";

export function mapToPostViewModel(
  post: WithId<Post>,
  myStatus: string,
): PostViewModel {
  const rawNewest = post.newestLikes ?? [];

  const newestLikes: LikeInfoViewModel[] = rawNewest
    .slice() // clone
    .sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime())
    .slice(0, 3)
    .map(({ addedAt, userId, login }) => ({
      addedAt: addedAt.toISOString(),
      userId,
      login,
    }));

  const extendedLikesInfo: ExtendedLikesInfoViewModel = {
    likesCount: post.likeCount,
    dislikesCount: post.dislikeCount,
    myStatus: myStatus,
    newestLikes,
  };

  return {
    id: post._id.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName,
    createdAt: post.createdAt.toISOString(),
    extendedLikesInfo,
  };
}
