import express from "express";
import { setupApp } from "../../../src/setup-app";
import { generateBasicAuthToken } from "../utils/generate-admin-auth-token";
import { runDb } from "../../../src/db/mongo.db";
import { clearDb } from "../utils/clear-db";
import { UserInput } from "../../../src/users/dto/user.input-dto";
import request from "supertest";
import { HttpStatus } from "../../../src/core/types/http-statuses";
import { USERS_PATH } from "../../../src/core/paths/paths";
import { appConfig } from "../../../src/core/settings/settings";

describe("Blogs API validation", () => {
  const app = express();
  setupApp(app);

  const adminToken = generateBasicAuthToken();

  const correctTestUserData: UserInput = {
    login: "123456",
    password: "123456",
    email: "test@test.com",
  };
  beforeAll(async () => {
    await runDb(appConfig.MONGO_URI);
    await clearDb(app);
  });

  it(`should not create user when incorrect body passed; POST /user'`, async () => {
    const invalidDataSet1 = await request(app)
      .post(USERS_PATH)
      .set("Authorization", adminToken)
      .send({
        ...correctTestUserData,
        login: " ",
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet1.body.errorsMessages).toHaveLength(1);

    const invalidDataSet2 = await request(app)
      .post(USERS_PATH)
      .set("Authorization", adminToken)
      .send({
        ...correctTestUserData,
        password: " ",
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet2.body.errorsMessages).toHaveLength(1);

    const invalidDataSet3 = await request(app)
      .post(USERS_PATH)
      .set("Authorization", adminToken)
      .send({
        ...correctTestUserData,
        email: " ",
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet3.body.errorsMessages).toHaveLength(1);

    const invalidDataSet4 = await request(app)
      .post(USERS_PATH)
      .set("Authorization", adminToken)
      .send({
        ...correctTestUserData,
        email: " ",
        login: " ",
        password: " ",
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet4.body.errorsMessages).toHaveLength(3);

    const userListResponse = await request(app)
      .get(USERS_PATH)
      .set("Authorization", adminToken);
    expect(userListResponse.body.items).toHaveLength(0);
  });
});
