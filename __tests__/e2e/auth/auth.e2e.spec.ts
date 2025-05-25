import express from "express";
import { setupApp } from "../../../src/setup-app";
import { clearDb } from "../utils/clear-db";
import { client, runDb, setIsTestMode } from "../../../src/db/mongo.db";
import { appConfig } from "../../../src/core/settings/settings";
import { createUser } from "../utils/users/create-user";
import request from "supertest";
import { AUTH_PATH } from "../../../src/core/paths/paths";
import { HttpStatus } from "../../../src/core/types/http-statuses";
import { UserInput } from "../../../src/users/dto/user.input-dto";
import { getUserDto } from "../utils/users/get-user-dto";

describe("Auth API", () => {
  const app = express();
  setupApp(app);

  beforeAll(async () => {
    setIsTestMode(true); // Переключаемся на тестовую базу данных
    await runDb(appConfig.MONGO_URI); // Подключаемся к MongoDB
    await clearDb(app);
  });

  beforeEach(async () => {
    await clearDb(app);
  });

  afterAll(async () => {
    if (client) {
      await client.close();
    }
  });

  it("should login user with valid credentials, /auth/login", async () => {
    const user = await createUser(app);

    const response = await request(app)
      .post(`${AUTH_PATH}/login`)
      .send({ loginOrEmail: user.email, password: "111111" });

    expect(response.status).toBe(HttpStatus.Ok);
    expect(response.body).toHaveProperty("accessToken");
  });

  it("should return 401 if invalid credentials, /auth/login", async () => {
    const user = await createUser(app);

    const response = await request(app)
      .post(`${AUTH_PATH}/login`)
      .send({ loginOrEmail: user.email, password: "wrong-password" });

    expect(response.status).toBe(HttpStatus.Unauthorized);
  });

  it("about user, GET /auth/me", async () => {
    const newUser: UserInput = {
      ...getUserDto(),
      login: "admin",
      password: "123456",
      email: "admin@example.com",
    };

    const user = await createUser(app, newUser);

    const loginResponse = await request(app)
      .post(`${AUTH_PATH}/login`)
      .send({ loginOrEmail: newUser.email, password: newUser.password });

    expect(loginResponse.status).toBe(HttpStatus.Ok);

    const token = loginResponse.body.accessToken;

    const response = await request(app)
      .get(`${AUTH_PATH}/me`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(HttpStatus.Ok);
  });

  it("should NOT allow reuse of refresh token after it was used once", async () => {
    const user = await createUser(app);
    const loginRes = await request(app)
      .post("/auth/login")
      .send({ loginOrEmail: user.email, password: "111111" });

    expect(loginRes.status).toBe(HttpStatus.Ok);

    // Извлекаем refresh token из заголовка Set-Cookie
    const cookies = loginRes.headers["set-cookie"];
    const cookieArray = Array.isArray(cookies) ? cookies : [cookies];
    const refreshTokenCookie = cookieArray.find((cookie) =>
      cookie?.startsWith("refreshToken="),
    );

    if (!refreshTokenCookie) {
      throw new Error("Refresh token not found in cookies");
    }

    const originalRefreshToken = refreshTokenCookie.split(";")[0].split("=")[1];

    const accessToken = loginRes.body.accessToken;

    // Первый запрос на обновление токена → должен пройти успешно
    let refreshRes = await request(app)
      .post("/auth/refresh-token")
      .set("Authorization", `Bearer ${accessToken}`)
      .set("Cookie", `refreshToken=${originalRefreshToken}`);

    expect(refreshRes.status).toBe(HttpStatus.Ok);
    const newAccessToken = refreshRes.body.accessToken;

    // Второй запрос с тем же refresh token → должен вернуть 401
    const secondRefreshRes = await request(app)
      .post("/auth/refresh-token")
      .set("Authorization", `Bearer ${newAccessToken}`)
      .set("Cookie", `refreshToken=${originalRefreshToken}`);

    expect(secondRefreshRes.status).toBe(HttpStatus.Unauthorized);
  });
});
