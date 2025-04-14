import { PostInput } from "../../../../src/posts/dto/post.input-dto";

export function getPostDto(blogId: string) {
  return {
    title: "defaultTitle",
    shortDescription: "defaultShortDescription",
    content: "defaultContent",
    blogId,
  };
}
