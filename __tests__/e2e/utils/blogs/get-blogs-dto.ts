import { BlogInput } from "../../../../src/blogs/dto/blog.input-dto";

export function getBlogsDto(): BlogInput {
  return {
    name: "Test1",
    description: "string",
    websiteUrl: "https://someurl.com",
  };
}
