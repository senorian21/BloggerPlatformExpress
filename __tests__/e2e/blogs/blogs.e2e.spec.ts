import request from "supertest";
import express from "express";

import { setupApp } from "../../../src/setup-app";
import { BlogInput } from "../../../src/blogs/dto/blog.input-dto";
import { HttpStatus } from "../../../src/core/types/http-statuses";

import { BLOGS_PATH } from "../../../src/core/paths/paths";
import { generateBasicAuthToken } from "../utils/generate-admin-auth-token";
import { clearDb } from "../utils/clear-db";

describe("Blogs API", () => {
  const app = express();
  setupApp(app);

  const adminToken = generateBasicAuthToken();

  const testBlogsData: BlogInput = {
    name: "string",
    description: "string",
    websiteUrl: "https://example.com/folder/subfolder/",
  };

  beforeAll(async () => {
    await clearDb(app);
  });

  it("should create blog; POST /blogs", async () => {
    const newBlog: BlogInput = {
      ...testBlogsData,
      name: "Jaba",
      description: "qwfsddsd",
    };

    await request(app)
      .post(BLOGS_PATH)
      .set("Authorization", adminToken)
      .send(newBlog)
      .expect(HttpStatus.Created);
  });

  it("should return blogs list ; GET /blogs", async () => {
    await request(app)
      .post(BLOGS_PATH)
      .set("Authorization", adminToken)
      .send({ ...testBlogsData, name: "Blogs1" })
      .expect(HttpStatus.Created);

    await request(app)
      .post(BLOGS_PATH)
      .set("Authorization", adminToken)
      .send({ ...testBlogsData, name: "Blogs2" })
      .expect(HttpStatus.Created);

    const blogsLIst = await request(app).get(BLOGS_PATH).expect(HttpStatus.Ok);

    expect(blogsLIst.body).toBeInstanceOf(Array);
    expect(blogsLIst.body.length).toBeGreaterThanOrEqual(2);
  });

  it("should return blog by id; GET /blogs/:id", async () => {
    const createResponse = await request(app)
      .post(BLOGS_PATH)
      .set("Authorization", adminToken)
      .send({ ...testBlogsData, name: "Blog1" })
      .expect(HttpStatus.Created);

    const getResponse = await request(app)
      .get(`${BLOGS_PATH}/${createResponse.body.id}`)
      .expect(HttpStatus.Ok);

    expect(getResponse.body).toEqual({
      ...createResponse.body,
    });
  });

  it("should update blogs; PUT /blogs/:id", async () => {
    const createResponse = await request(app)
      .post(BLOGS_PATH)
      .set("Authorization", adminToken)
      .send({ ...testBlogsData, name: "Blog1" })
      .expect(HttpStatus.Created);

    const updateBlogs: BlogInput = {
      name: "Blog1",
      description: "qwfsddsd",
      websiteUrl: "https://example.com/folder/subfolder/",
    };
    await request(app)
      .put(`${BLOGS_PATH}/${createResponse.body.id}`)
      .set("Authorization", adminToken)
      .send(updateBlogs)
      .expect(HttpStatus.NoContent);

    const blogsResponse = await request(app).get(
      `${BLOGS_PATH}/${createResponse.body.id}`,
    );

    expect(blogsResponse.body).toEqual({
      id: createResponse.body.id,
      ...updateBlogs,
    });
  });

  it("DELETE blogs/:id and check after NOT FOUND", async () => {
    const createResponse = await request(app)
      .post(BLOGS_PATH)
      .set("Authorization", adminToken)
      .send({ ...testBlogsData, name: "Blog1" })
      .expect(HttpStatus.Created);
    await request(app)
      .delete(`${BLOGS_PATH}/${createResponse.body.id}`)
      .set("Authorization", adminToken)
      .expect(HttpStatus.NoContent);

    const blogsResponse = await request(app).get(
      `${BLOGS_PATH}/${createResponse.body.id}`,
    );
    expect(blogsResponse.status).toBe(HttpStatus.NotFound);
  });
});
