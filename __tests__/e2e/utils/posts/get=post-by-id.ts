import { Express } from "express";
import { HttpStatus } from "../../../../src/core/types/http-statuses";
import request from "supertest";
import { POSTS_PATH } from "../../../../src/core/paths/paths";

export async function getPostById(
  app: Express,
  postId: string,
  expectedStatus?: HttpStatus,
): Promise<any> {
  const testStatus = expectedStatus ?? HttpStatus.Ok;

  const response = await request(app)
    .get(`${POSTS_PATH}/${postId}`)
    .expect(testStatus);

  if (expectedStatus === HttpStatus.NotFound) {
    return response.status;
  }

  return response.body;
}
