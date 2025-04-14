import { Express } from "express";
import { blogViewModel } from "../../../../src/blogs/types/blog-view-model";
import { getBlogsDto } from "./get-blogs-dto";
import request from "supertest";
import { generateBasicAuthToken } from "../generate-admin-auth-token";
import { HttpStatus } from "../../../../src/core/types/http-statuses";
import { BLOGS_PATH } from "../../../../src/core/paths/paths";
import { BlogInput } from "../../../../src/blogs/dto/blog.input-dto";

export async function createBlog(
  app: Express,
  blogDto?: BlogInput,
): Promise<blogViewModel> {
  const defaultBlogData = getBlogsDto();

  const testBlogData = { ...defaultBlogData, ...blogDto };

  const createdBlogRespons = await request(app)
    .post(BLOGS_PATH)
    .set("Authorization", generateBasicAuthToken())
    .send(testBlogData)
    .expect(HttpStatus.Created);

  return createdBlogRespons.body;
}
