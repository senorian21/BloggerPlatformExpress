import request from "supertest";
import express from "express";

import { setupApp } from "../../../src/setup-app";
import { PostInput } from "../../../src/posts/dto/post.input-dto";
import { HttpStatus } from "../../../src/core/types/http-statuses";

import { BLOGS_PATH, POSTS_PATH } from "../../../src/core/paths/paths";
import { generateBasicAuthToken } from "../utils/generate-admin-auth-token";
import { clearDb } from "../utils/clear-db";
import { BlogInput } from "../../../src/blogs/dto/blog.input-dto";

describe("Posts API", () => {
  const app = express();
  setupApp(app);

  const adminToken = generateBasicAuthToken();

  beforeAll(async () => {
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

  it("should create post; POST /posts", async () => {
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

    expect(createBlogResponse.body).toHaveProperty("id");

    const newPost: PostInput = {
      ...testPostData,
      title: "1_1",
      blogId: createBlogResponse.body.id,
    };

    const createPostResponse = await request(app)
      .post(POSTS_PATH)
      .set("Authorization", adminToken)
      .send(newPost)
      .expect(HttpStatus.Created);

    const getСreatePostResponse = await request(app).get(POSTS_PATH);

    expect(getСreatePostResponse.body).toBeInstanceOf(Array);
    expect(getСreatePostResponse.body.length).toBeGreaterThanOrEqual(1);
  });

  it("should return post by id; GET /get/:id", async () => {
    const newBlog: BlogInput = {
      ...testBlogsData,
      name: "Jaba",
      description: "qwfsddsd",
      websiteUrl: "https://example.com", // Если обязательное поле
    };

    const createBlogResponse = await request(app)
      .post(BLOGS_PATH)
      .set("Authorization", adminToken)
      .send(newBlog)
      .expect(HttpStatus.Created);

    expect(createBlogResponse.body).toHaveProperty("id");
    const blogId = createBlogResponse.body.id; // Сохраняем ID блога

    const newPost: PostInput = {
      ...testPostData,
      title: "1_1",
      blogId,
    };

    // Создание поста
    const createPostResponse = await request(app)
      .post(POSTS_PATH)
      .set("Authorization", adminToken)
      .send(newPost)
      .expect(HttpStatus.Created);

    expect(createPostResponse.body).toHaveProperty("id");
    const postId = createPostResponse.body.id; // Сохраняем ID поста

    // Получение поста по ID
    const PostResponse = await request(app)
      .get(`${POSTS_PATH}/${postId}`)
      .expect(HttpStatus.Ok);

    expect(PostResponse.body).toMatchObject({
      id: postId,
      title: "1_1",
      blogId: blogId,
      shortDescription: testPostData.shortDescription,
      content: testPostData.content,
    });
  });
  it("should delete post by id and verify NOT FOUND; DELETE /posts/:id", async () => {
    // Данные для создания блога
    const newBlog: BlogInput = {
      ...testBlogsData,
      name: "Jaba",
      description: "qwfsddsd",
      websiteUrl: "https://example.com", // Обязательное поле
    };

    // Создание нового блога
    const createBlogResponse = await request(app)
      .post(BLOGS_PATH)
      .set("Authorization", adminToken)
      .send(newBlog)
      .expect(HttpStatus.Created);

    expect(createBlogResponse.body).toHaveProperty("id");
    const blogId = createBlogResponse.body.id;

    // Данные для создания поста
    const newPost: PostInput = {
      ...testPostData,
      title: "Test Post",
      blogId,
    };

    // Создание нового поста
    const createPostResponse = await request(app)
      .post(POSTS_PATH)
      .set("Authorization", adminToken)
      .send(newPost)
      .expect(HttpStatus.Created);

    expect(createPostResponse.body).toHaveProperty("id");
    const postId = createPostResponse.body.id;

    // Удаление созданного поста
    await request(app)
      .delete(`${POSTS_PATH}/${postId}`)
      .set("Authorization", adminToken)
      .expect(HttpStatus.NoContent);

    // Проверка, что пост больше не существует
    const postsResponse = await request(app)
      .get(`${POSTS_PATH}/${postId}`)
      .expect(HttpStatus.NotFound);

    // Убедимся, что возвращается статус "Not Found"
    expect(postsResponse.status).toBe(HttpStatus.NotFound);
  });
  it("should return blogs list ; GET /blogs", async () => {
    // Данные для создания блога
    const newBlog: BlogInput = {
      ...testBlogsData,
      name: "Jaba",
      description: "qwfsddsd",
      websiteUrl: "https://example.com", // Обязательное поле
    };

    // Создание нового блога
    const createBlogResponse = await request(app)
      .post(BLOGS_PATH)
      .set("Authorization", adminToken)
      .send(newBlog)
      .expect(HttpStatus.Created);

    expect(createBlogResponse.body).toHaveProperty("id");
    const blogId = createBlogResponse.body.id;

    // Данные для создания поста
    const newPost: PostInput = {
      ...testPostData,
      title: "Test Post",
      blogId,
    };

    // Создание нового поста
    const createPostResponse = await request(app)
      .post(POSTS_PATH)
      .set("Authorization", adminToken)
      .send(newPost)
      .expect(HttpStatus.Created);

    const createPostResponse1 = await request(app)
      .post(POSTS_PATH)
      .set("Authorization", adminToken)
      .send({ ...newPost, title: "Test" })
      .expect(HttpStatus.Created);

    const postsLIst = await request(app).get(POSTS_PATH).expect(HttpStatus.Ok);

    expect(postsLIst.body).toBeInstanceOf(Array);
    expect(postsLIst.body.length).toBeGreaterThanOrEqual(2);
  });
});
