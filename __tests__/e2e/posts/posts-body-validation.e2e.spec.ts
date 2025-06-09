import request from "supertest";
import express from "express";
import { setupApp } from "../../../src/setup-app";
import { PostInput } from "../../../src/posts/dto/post.input-dto";
import { HttpStatus } from "../../../src/core/types/http-statuses";
import { BLOGS_PATH, POSTS_PATH } from "../../../src/core/paths/paths";
import { clearDb } from "../utils/clear-db";
import { BlogInput } from "../../../src/blogs/dto/blog.input-dto";
import { runDb } from "../../../src/db/mongo.db";
import { generateBasicAuthToken } from "../utils/generate-admin-auth-token";

describe("Posts API", () => {
  const app = express();
  setupApp(app);

  const adminToken = generateBasicAuthToken();

  beforeAll(async () => {
    await runDb("mongodb://localhost:27017/BloggerPlatform-test");
    await clearDb(app);
  });

  const testPostData: PostInput = {
    title: "1_1",
    shortDescription: "1_1",
    content: "string",
    blogId: "1",
  };

  const testBlogsData: BlogInput = {
    name: "string",
    description: "string",
    websiteUrl: "https://example.com/folder/subfolder/",
  };

  it(`should not create blog when incorrect body passed; POST /blogs'`, async () => {
    const newBlog: BlogInput = {
      ...testBlogsData,
      name: "Jaba",
      description: "qwfsddsd",
    };

    const createBlogResponse = await request(app)
      .post(BLOGS_PATH)
      .set("Authorization", adminToken)
      .send(newBlog)
      .expect(HttpStatus.Created);

    const newPost: PostInput = {
      ...testPostData,
      title: "  ",
      blogId: createBlogResponse.body.id,
    };

    const createPostResponse = await request(app)
      .post(POSTS_PATH)
      .set("Authorization", adminToken)
      .send(newPost)
      .expect(HttpStatus.BadRequest);

    expect(createPostResponse.body.errorsMessages).toHaveLength(1);

    const newPost1: PostInput = {
      ...testPostData,
      title: "  ",
      blogId: "createBlogResponse.body.id",
    };

    const createPostResponse1 = await request(app)
      .post(POSTS_PATH)
      .set("Authorization", adminToken)
      .send(newPost1)
      .expect(HttpStatus.BadRequest);

    expect(createPostResponse1.body.errorsMessages).toHaveLength(2);
  });
});
