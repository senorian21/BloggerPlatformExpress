export function getPostDto(blogId: string) {
  return {
    title: "defaultTitle",
    shortDescription: "defaultShortDescription",
    content: "defaultContent",
    blogId,
  };
}
