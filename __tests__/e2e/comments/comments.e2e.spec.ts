import express from "express";
import { setupApp } from "../../../src/setup-app";
import { generateBasicAuthToken } from "../utils/generate-admin-auth-token";
import { client, runDb, setIsTestMode } from "../../../src/db/mongo.db";
import { appConfig } from "../../../src/core/settings/settings";
import { clearDb } from "../utils/clear-db";
import { createBlog } from "../utils/blogs/create-blog";
import { createPost } from "../utils/posts/create-post";
import { PostInput } from "../../../src/posts/dto/post.input-dto";
import { getPostDto } from "../utils/posts/get-posts-dto";
import { createUser } from "../utils/users/create-user";
import request from "supertest";
import {
  AUTH_PATH,
  COMMENTS_PATH,
  POSTS_PATH,
} from "../../../src/core/paths/paths";
import { HttpStatus } from "../../../src/core/types/http-statuses";
import { UserInput } from "../../../src/users/dto/user.input-dto";

describe("Comments API", () => {
  const app = express();
  setupApp(app);

  const adminToken = generateBasicAuthToken();

  beforeAll(async () => {
    setIsTestMode(true); // Переключаемся на тестовую базу данных
    await runDb(appConfig.MONGO_URI); // Подключаемся к MongoDB
    await clearDb(app);
  });

  afterAll(async () => {
    if (client) {
      await client.close(); // Закрываем соединение после завершения тестов
    }
  });

  it("Create comment by post, POST posts/{postId}/comments", async () => {
    const blog = await createBlog(app);
    const newPost: PostInput = {
      ...getPostDto,
      title: "1_1",
      shortDescription: "ShortDescription",
      content: "Content",
      blogId: blog.id,
    };
    const post = await createPost(app, newPost);

    const user = await createUser(app);

    const loginResponse = await request(app)
      .post(`${AUTH_PATH}/login`)
      .send({
        loginOrEmail: user.login,
        password: "111111",
      })
      .expect(HttpStatus.Ok);

    const accessToken = loginResponse.body.accessToken;
    expect(accessToken).toBeDefined();

    const createCommentResponse = await request(app)
      .post(`${POSTS_PATH}/${post.id}/comments`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        content: "This is a test comment.",
      })
      .expect(HttpStatus.Created);

    const comment = createCommentResponse.body;
    expect(comment).toHaveProperty("id");
  });

  it("Get comment list by post, GET posts/{postId}/comments", async () => {
    const blog = await createBlog(app);
    const newPost: PostInput = {
      ...getPostDto,
      title: "1_1",
      shortDescription: "ShortDescription",
      content: "Content",
      blogId: blog.id,
    };
    const post = await createPost(app, newPost);

    const newUser: UserInput = {
      login: "123456456",
      password: "123456213",
      email: "test@test11.com",
    };
    const user = await createUser(app, newUser);

    const loginResponse = await request(app)
      .post(`${AUTH_PATH}/login`)
      .send({
        loginOrEmail: user.login,
        password: "123456213",
      })
      .expect(HttpStatus.Ok);

    const accessToken = loginResponse.body.accessToken;
    expect(accessToken).toBeDefined();

    const createCommentResponse1 = await request(app)
      .post(`${POSTS_PATH}/${post.id}/comments`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        content: "This is a test comment1111111123.",
      })
      .expect(HttpStatus.Created);

    const createCommentResponse2 = await request(app)
      .post(`${POSTS_PATH}/${post.id}/comments`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        content: "This is a test comment.",
      })
      .expect(HttpStatus.Created);

    console.log(`GET ${POSTS_PATH}/${post.id}/comments`); // Логируем путь
    const getCommentListByPostsResponse = await request(app)
      .get(`${POSTS_PATH}/${post.id}/comments`)
      .expect(HttpStatus.Ok);

    expect(getCommentListByPostsResponse.body.items).toHaveLength(2);
  });

  it("Update existing comment by id , PUT /comments/{commentId}", async () => {
    const blog = await createBlog(app);
    const newPost: PostInput = {
      ...getPostDto,
      title: "Test Post",
      shortDescription: "ShortDescription",
      content: "Content",
      blogId: blog.id,
    };
    const post = await createPost(app, newPost);
    const newUser: UserInput = {
      login: "111111111",
      password: "123456213",
      email: "test111@test11.com",
    };
    const user = await createUser(app, newUser);
    const loginResponse = await request(app)
      .post(`${AUTH_PATH}/login`)
      .send({
        loginOrEmail: user.login,
        password: newUser.password,
      })
      .expect(HttpStatus.Ok);

    const accessToken = loginResponse.body.accessToken;
    expect(accessToken).toBeDefined();

    const createCommentResponse = await request(app)
      .post(`${POSTS_PATH}/${post.id}/comments`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        content: "Original comment content.",
      })
      .expect(HttpStatus.Created);

    const originalComment = createCommentResponse.body;
    expect(originalComment).toHaveProperty("id");

    const updatedContent = "Updated comment content.";
    const updateCommentResponse = await request(app)
      .put(`${COMMENTS_PATH}/${originalComment.id}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        content: updatedContent,
      })
      .expect(HttpStatus.NoContent);

    const getCommentResponse = await request(app)
      .get(`${COMMENTS_PATH}/${originalComment.id}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(HttpStatus.Ok);

    const updatedComment = getCommentResponse.body;
    expect(updatedComment.content).toBe(updatedContent);
  });
  it("Delete existing comment by id, DELETE /comments/{commentId}", async () => {
    const blog = await createBlog(app);
    const newPost: PostInput = {
      ...getPostDto,
      title: "Test Post",
      shortDescription: "ShortDescription",
      content: "Content",
      blogId: blog.id,
    };
    const post = await createPost(app, newPost);
    const newUser: UserInput = {
      login: "22222",
      password: "qwerty22",
      email: "example@example.com",
    };
    const user = await createUser(app, newUser);
    const loginResponse = await request(app)
      .post(`${AUTH_PATH}/login`)
      .send({
        loginOrEmail: user.login,
        password: newUser.password,
      })
      .expect(HttpStatus.Ok);

    const accessToken = loginResponse.body.accessToken;
    expect(accessToken).toBeDefined();

    const createCommentResponse = await request(app)
      .post(`${POSTS_PATH}/${post.id}/comments`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        content: "Original comment content.",
      })
      .expect(HttpStatus.Created);

    const originalComment = createCommentResponse.body;
    expect(originalComment).toHaveProperty("id");

    const deleteCommentResponse = await request(app)
      .delete(`${COMMENTS_PATH}/${originalComment.id}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(HttpStatus.NoContent);

    const getCommentResponse = await request(app)
      .get(`${COMMENTS_PATH}/${originalComment.id}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(HttpStatus.NotFound);
  });
  it("Get existing comment by id, GET /comments/{id}", async () => {
    const blog = await createBlog(app);
    const newPost: PostInput = {
      ...getPostDto,
      title: "Test Post",
      shortDescription: "ShortDescription",
      content: "Content",
      blogId: blog.id,
    };
    const post = await createPost(app, newPost);

    const newUser: UserInput = {
      login: "33333",
      password: "qwerty333",
      email: "example3@example3.com",
    };
    const user = await createUser(app, newUser);
    const loginResponse = await request(app)
      .post(`${AUTH_PATH}/login`)
      .send({
        loginOrEmail: user.login,
        password: newUser.password,
      })
      .expect(HttpStatus.Ok);

    const accessToken = loginResponse.body.accessToken;
    expect(accessToken).toBeDefined();

    const createCommentResponse = await request(app)
      .post(`${POSTS_PATH}/${post.id}/comments`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        content: "Original comment content.",
      })
      .expect(HttpStatus.Created);

    const originalComment = createCommentResponse.body;
    expect(originalComment).toHaveProperty("id");

    const getCommentResponse = await request(app)
      .get(`${COMMENTS_PATH}/${originalComment.id}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(HttpStatus.Ok);

    const retrievedComment = getCommentResponse.body;
    expect(retrievedComment).toHaveProperty("id");
    expect(retrievedComment).toHaveProperty(
      "content",
      "Original comment content.",
    );
    expect(retrievedComment).toHaveProperty("commentatorInfo.userId");
    expect(retrievedComment).toHaveProperty("commentatorInfo.userLogin");
    expect(retrievedComment).toHaveProperty("createdAt");
  });
});
