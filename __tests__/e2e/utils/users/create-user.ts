import { Express } from "express";
import { UserInput } from "../../../../src/users/dto/user.input-dto";
import { userViewModel } from "../../../../src/users/types/user-view-model";
import { getUserDto } from "./get-user-dto";
import request from "supertest";
import { USERS_PATH } from "../../../../src/core/paths/paths";
import { generateBasicAuthToken } from "../generate-admin-auth-token";
import { HttpStatus } from "../../../../src/core/types/http-statuses";

export async function createUser(
  app: Express,
  userDto?: UserInput,
): Promise<userViewModel> {
  const defaultUserData = getUserDto();

  const testUserData = { ...defaultUserData, ...userDto };

  const createdUserRespons = await request(app)
    .post(USERS_PATH)
    .set("Authorization", generateBasicAuthToken())
    .send(testUserData)
    .expect(HttpStatus.Created);

  return createdUserRespons.body;
}
