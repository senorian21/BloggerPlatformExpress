import request from "supertest";
import express from "express";

import { setupApp } from "../../../src/setup-app";
import { BlogInput } from "../../../src/blogs/dto/blog.input-dto";
import { HttpStatus } from "../../../src/core/types/http-statuses";

import { BLOGS_PATH } from "../../../src/core/paths/paths";
import { generateBasicAuthToken } from "../utils/generate-admin-auth-token";
import { clearDb } from "../utils/clear-db";
import { runDb } from "../../../src/db/mongo.db";
import { createBlog } from "../utils/blogs/create-blog";
import { getBlogsDto } from "../utils/blogs/get-blogs-dto";
import { getBlogById } from "../utils/blogs/get-blog-by-id";
import { updateBlog } from "../utils/blogs/update-blog";

describe("Blogs API", () => {
  const app = express();
  setupApp(app);

  const adminToken = generateBasicAuthToken();

  beforeAll(async () => {
    await runDb("mongodb://localhost:27017/BloggerPlatform-test");
    await clearDb(app);
  });

  it("should create blog; POST /blogs", async () => {
    const newBlog: BlogInput = {
      ...getBlogsDto(),
      name: "Jaba",
      description: "qwfsddsd",
      websiteUrl: "https://someurl.com",
    };

    await createBlog(app, newBlog);
  });

  it("should return blogs list ; GET /blogs", async () => {
    await createBlog(app);
    await createBlog(app);

    const response = await request(app).get(BLOGS_PATH).expect(HttpStatus.Ok);

    expect(response.body.items).toBeInstanceOf(Array);

  });

  it("should return blog by id; GET /blogs/:id", async () => {
    const blogCreated = await createBlog(app);

    const blog = await getBlogById(app, blogCreated.id);

    expect(blog).toEqual({
      ...blogCreated,
      id: expect.any(String),
      createdAt: expect.any(String),
    });
  });

  it("should update blogs; PUT /blogs/:id", async () => {
    const blogCreated = await createBlog(app);

    const blogUpdateData: BlogInput = {
      name: "1111",
      description: "1111",
      websiteUrl: "https://example.com/folder/subfolder/",
    };

    await updateBlog(app, blogCreated.id, blogUpdateData);

    const blogsResponse = await getBlogById(app, blogCreated.id);

    expect(blogsResponse).toMatchObject({
      name: "1111",
      description: "1111",
      websiteUrl: "https://example.com/folder/subfolder/",
    });
  });

  it("DELETE blogs/:id and check after NOT FOUND", async () => {
    const createResponse = await createBlog(app);
    await request(app)
      .delete(`${BLOGS_PATH}/${createResponse.id}`)
      .set("Authorization", adminToken)
      .expect(HttpStatus.NoContent);

    const blogsResponse = await request(app).get(
      `${BLOGS_PATH}/${createResponse.id}`,
    );
    expect(blogsResponse.status).toBe(HttpStatus.NotFound);
  });
});
