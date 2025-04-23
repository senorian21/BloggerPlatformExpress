import request from "supertest";
import express from "express";

import { setupApp } from "../../../src/setup-app";
import { BlogInput } from "../../../src/blogs/dto/blog.input-dto";
import { HttpStatus } from "../../../src/core/types/http-statuses";

import { BLOGS_PATH, TESTING_PATH } from "../../../src/core/paths/paths";
import { generateBasicAuthToken } from "../utils/generate-admin-auth-token";
import { clearDb } from "../utils/clear-db";
import { runDb } from "../../../src/db/mongo.db";
import { createBlog } from "../utils/blogs/create-blog";
import { getBlogsDto } from "../utils/blogs/get-blogs-dto";
import { getBlogById } from "../utils/blogs/get-blog-by-id";
import { updateBlog } from "../utils/blogs/update-blog";
import { PostInput } from "../../../src/posts/dto/post.input-dto";
import { createPost } from "../utils/posts/create-post";

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

  it("should return post blog by idBlog; GET /blogs/:id/posts", async () => {
    const blog = await createBlog(app);

    const newPost: PostInput = {
      title: "Test Post",
      shortDescription: "Short Description",
      content: "Content",
      blogId: blog.id,
    };

    await createPost(app, newPost);
    await createPost(app, newPost);
    const response = await request(app)
      .get(`/blogs/${blog.id}/posts`)
      .query({
        pageNumber: 1,
        pageSize: 10,
        sortBy: "createdAt",
        sortDirection: "desc",
      })
      .expect(200);

    expect(response.body.items).toHaveLength(2);
    expect(response.body.totalCount).toBe(2);
    await request(app)
      .delete(`${TESTING_PATH}/all-data`)
      .expect(HttpStatus.NoContent);
  });
  it("should return status 200; content: blog array with pagination", async () => {
    const blog1 = await createBlog(app, {
      name: "Blog 1",
      description: "Description for Blog 1",
      websiteUrl: "https://example1.com",
    });

    const blog2 = await createBlog(app, {
      name: "Blog 2",
      description: "Description for Blog 2",
      websiteUrl: "https://example2.com",
    });

    const blog3 = await createBlog(app, {
      name: "Blog 3",
      description: "Description for Blog 3",
      websiteUrl: "https://example3.com",
    });

    const response = await request(app)
      .get(BLOGS_PATH)
      .query({
        pageNumber: 1,
        pageSize: 10,
        sortBy: "createdAt",
        sortDirection: "desc",
      })
      .expect(HttpStatus.Ok);

    expect(response.body).toEqual(
      expect.objectContaining({
        items: expect.any(Array),
        page: expect.any(Number),
        pageSize: expect.any(Number),
        totalCount: expect.any(Number),
      }),
    );

    expect(response.body.items).toHaveLength(3);
    expect(response.body.items[0].name).toBe("Blog 3");
    expect(response.body.items[1].name).toBe("Blog 2");
    expect(response.body.items[2].name).toBe("Blog 1");

    expect(response.body.page).toBe(1);
    expect(response.body.pageSize).toBe(10);
    expect(response.body.totalCount).toBe(3);
  });
});
