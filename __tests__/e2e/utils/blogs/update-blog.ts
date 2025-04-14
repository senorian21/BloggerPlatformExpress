import { Express } from "express";
import { BlogInput } from "../../../../src/blogs/dto/blog.input-dto";
import { getBlogsDto } from "./get-blogs-dto";
import request from "supertest";
import { BLOGS_PATH } from "../../../../src/core/paths/paths";
import { generateBasicAuthToken } from "../generate-admin-auth-token";
import { HttpStatus } from "../../../../src/core/types/http-statuses";

export async function updateBlog(
  app: Express,
  blogId: string,
  blogDto: BlogInput,
) {
  const defaultBlogData: BlogInput = getBlogsDto();
  const testBlogData = { ...defaultBlogData, ...blogDto };

  const updatedBlogRespons = await request(app)
    .put(`${BLOGS_PATH}/${blogId}`)
    .set("Authorization", generateBasicAuthToken())
    .send(testBlogData)
    .expect(HttpStatus.NoContent);
}
