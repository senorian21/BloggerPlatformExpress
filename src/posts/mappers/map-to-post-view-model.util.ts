import { WithId } from "mongodb";
import { postViewModel } from "../types/post-view-model";
import { Post } from "../domain/post.entity";

export function mapToPostViewModel(post: WithId<Post>): postViewModel {
  return {
    id: post._id.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName,
    createdAt: post.createdAt,
  };
}
