import { Express } from "express";
import { blogViewModel } from "../../../../src/blogs/types/blog-view-model";
import { BLOGS_PATH } from "../../../../src/core/paths/paths";
import { HttpStatus } from "../../../../src/core/types/http-statuses";
import request from "supertest";

export async function getBlogById(
  app: Express,
  blogId: string,
): Promise<blogViewModel> {
  const blogResponse = await request(app)
    .get(`${BLOGS_PATH}/${blogId}`)
    .expect(HttpStatus.Ok);

  return blogResponse.body;
}
