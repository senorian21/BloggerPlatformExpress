import request from "supertest";
import express from "express";

import { setupApp } from "../../../src/setup-app";
import { PostInput } from "../../../src/posts/dto/post.input-dto";
import { HttpStatus } from "../../../src/core/types/http-statuses";

import { POSTS_PATH } from "../../../src/core/paths/paths";
import { generateBasicAuthToken } from "../utils/generate-admin-auth-token";
import { clearDb } from "../utils/clear-db";
import { runDb } from "../../../src/db/mongo.db";
import { getPostDto } from "../utils/posts/get-posts-dto";
import { createPost } from "../utils/posts/create-post";
import { createBlog } from "../utils/blogs/create-blog";
import { getPostById } from "../utils/posts/get=post-by-id";
import { updateBlog } from "../utils/blogs/update-blog";
import { updatePost } from "../utils/posts/update-post";

describe("Posts API", () => {
  const app = express();
  setupApp(app);

  const adminToken = generateBasicAuthToken();

  beforeAll(async () => {
    await runDb("mongodb://localhost:27017/BloggerPlatform-test");
    await clearDb(app);
  });

  it("should create post; POST /posts", async () => {
    const createdBlog = await createBlog(app);
    const newPost: PostInput = {
      ...getPostDto,
      title: "1_1",
      shortDescription: "ShortDescription",
      content: "Content",
      blogId: createdBlog.id,
    };
    await createPost(app, newPost);
  });

  it("should return post by id; GET /get/:id", async () => {
    const blog = await createBlog(app);

    const newPost: PostInput = {
      ...getPostDto,
      title: "1_1",
      shortDescription: "ShortDescription",
      content: "Content",
      blogId: blog.id,
    };

    const post = await createPost(app, newPost);

    const PostResponse = await getPostById(app, post.id);

    expect(PostResponse).toMatchObject({
      title: "1_1",
      shortDescription: "ShortDescription",
      content: "Content",
      blogId: blog.id,
    });
  });
  it("should delete post by id and verify NOT FOUND; DELETE /posts/:id", async () => {
    const blogCreated = await createBlog(app);

    const newPost: PostInput = {
      ...getPostDto,
      title: "1_1",
      shortDescription: "ShortDescription",
      content: "Content",
      blogId: blogCreated.id,
    };

    const post = await createPost(app, newPost);

    // Удаление созданного поста
    await request(app)
      .delete(`${POSTS_PATH}/${post.id}`)
      .set("Authorization", adminToken)
      .expect(HttpStatus.NoContent);

    const postsResponse = await getPostById(app, post.id, HttpStatus.NotFound);

    expect(postsResponse).toBe(HttpStatus.NotFound);
  });
  it("should return blogs list ; GET /blogs", async () => {
    // Создаем блог
    const blog = await createBlog(app);

    // Создаем посты для блога
    const newPost: PostInput = {
      ...getPostDto,
      title: "1_1",
      shortDescription: "ShortDescription",
      content: "Content",
      blogId: blog.id,
    };
    await createPost(app, newPost);
    await createPost(app, newPost);

    const postsList = await request(app).get(POSTS_PATH).expect(HttpStatus.Ok);

    expect(postsList.body.items).toBeInstanceOf(Array);
  });

  it("should update blogs; PUT /posts/:id", async () => {
    const blogCreated = await createBlog(app);
    const newPost: PostInput = {
      ...getPostDto,
      title: "1_1",
      shortDescription: "ShortDescription",
      content: "Content",
      blogId: blogCreated.id,
    };

    const post = await createPost(app, newPost);

    const updateDatePost: PostInput = {
      ...getPostDto,
      title: "1_1",
      shortDescription: "ShortDescription",
      content: "Content",
      blogId: blogCreated.id,
    };

    await updatePost(app, post.id, updateDatePost);

    const updatedPost = await getPostById(app, post.id);
    expect(updatedPost).toMatchObject({
      title: "1_1",
      shortDescription: "ShortDescription",
      content: "Content",
      blogId: blogCreated.id,
    });
  });
});
