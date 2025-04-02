import { Post } from "../../posts/types/post";
import { db } from "../../db/in-memory.db";
import { PostInput } from "../dto/post.input-dto";
import { HttpStatus } from "../../core/types/http-statuses";
import { Blog } from "../../blogs/types/blog";

export const postsRepository = {
  findAllPosts(): Post[] {
    return db.posts;
  },
  findPostById(id: string) {
    return db.posts.find((post) => post.id === id);
  },
  createPost(newPost: Post) {
    db.posts.push(newPost);
    return newPost;
  },
  updatePost(index: number, dto: Post) {
    const updatedPost: Post = {
      ...db.posts[index],
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: dto.blogId,
      blogName: dto.blogName,
    };
    db.posts[index] = updatedPost;
  },
  deletePost(id: string) {
    db.posts = db.posts.filter((p) => p.id !== id);
  },
};
