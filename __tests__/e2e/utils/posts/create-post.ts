import { Express } from "express";
import { PostInput } from "../../../../src/posts/dto/post.input-dto";
import { postViewModel } from "../../../../src/posts/types/post-view-model";
import { POSTS_PATH } from "../../../../src/core/paths/paths";
import { generateBasicAuthToken } from "../generate-admin-auth-token";
import request from "supertest";
import { HttpStatus } from "../../../../src/core/types/http-statuses";

export async function createPost(
  app: Express,
  postDto: PostInput,
): Promise<postViewModel> {
  const testPostData = { ...postDto };

  const createdPostResponse = await request(app)
    .post(POSTS_PATH)
    .set("Authorization", generateBasicAuthToken())
    .send(testPostData)
    .expect(HttpStatus.Created);

  return createdPostResponse.body;
}
