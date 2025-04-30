import express from "express";
import { setupApp } from "../../../src/setup-app";
import { generateBasicAuthToken } from "../utils/generate-admin-auth-token";
import { runDb } from "../../../src/db/mongo.db";
import { clearDb } from "../utils/clear-db";
import { getUserDto } from "../utils/users/get-user-dto";
import { UserInput } from "../../../src/users/dto/user.input-dto";
import { createUser } from "../utils/users/create-user";
import request from "supertest";
import { USERS_PATH } from "../../../src/core/paths/paths";
import { HttpStatus } from "../../../src/core/types/http-statuses";

describe("User API", () => {
  const app = express();
  setupApp(app);

  const adminToken = generateBasicAuthToken();

  beforeAll(async () => {
    await runDb("mongodb://localhost:27017/BloggerPlatform-test");
    await clearDb(app);
  });

  it("should create user; POST /users", async () => {
    const newUser: UserInput = {
      ...getUserDto(),
      login: "admin",
      password: "123456",
      email: "admin@example.com",
    };
    await createUser(app, newUser);
  });
  it("should return users list; GET /users", async () => {
    await clearDb(app);

    const user1: UserInput = {
      ...getUserDto(),
      login: "user1",
      password: "123456",
      email: "user1@example.com",
    };
    const user2: UserInput = {
      ...getUserDto(),
      login: "user2",
      password: "123456",
      email: "user2@example.com",
    };

    await createUser(app, user1);
    await createUser(app, user2);

    const response = await request(app)
      .get(USERS_PATH)
      .set("Authorization", adminToken)
      .query({
        pageNumber: 1,
        pageSize: 10,
        sortBy: "createdAt",
        sortDirection: "desc",
      })
      .expect(HttpStatus.Ok);

    expect(response.body.items).toBeInstanceOf(Array);
    expect(response.body.items.length).toBe(2);

    expect(response.body.page).toBe(1);
    expect(response.body.pageSize).toBe(10);

    const [firstUser, secondUser] = response.body.items;
    expect(firstUser.login).toBe(user2.login);
    expect(secondUser.login).toBe(user1.login);
  });

  it("DELETE users/:id ", async () => {
    await clearDb(app);
    const user1: UserInput = {
      ...getUserDto(),
      login: "user1",
      password: "123456",
      email: "user1@example.com",
    };
    const user2: UserInput = {
      ...getUserDto(),
      login: "user2",
      password: "123456",
      email: "user2@example.com",
    };

    const user = await createUser(app, user1);
    await createUser(app, user2);

    await request(app)
      .delete(`${USERS_PATH}/${user.id}`)
      .set("Authorization", adminToken)
      .expect(HttpStatus.NoContent);

    const usersResponse = await request(app)
      .get(`${USERS_PATH}`)
      .set("Authorization", adminToken);

    expect(usersResponse.body.items.length).toBe(1);
  });
});
