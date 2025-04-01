import { Blog } from "../blogs/types/blog";
import { Post } from "../posts/types/post";

export const db = {
  blogs: <Blog[]>[
    {
      id: "0",
      name: "Top mem pets",
      description: "string",
      websiteUrl: "string",
    },
    {
      id: "1",
      name: "How make videos&",
      description: "string",
      websiteUrl: "string",
    },
    {
      id: "2",
      name: "How&",
      description: "string",
      websiteUrl: "string",
    },
  ],

  posts: <Post[]>[
    {
      id: "0",
      title: "string",
      shortDescription: "string",
      content: "string",
      blogId: "1",
      blogName: "Top mem pets",
    },
    {
      id: "1",
      title: "string",
      shortDescription: "string",
      content: "string",
      blogId: "2",
      blogName: "How make videos&",
    },
    {
      id: "2",
      title: "string",
      shortDescription: "string",
      content: "string",
      blogId: "3",
      blogName: "How&",
    },
  ],
};
