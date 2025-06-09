import express from "express";
import { setupApp } from "../../../src/setup-app";
import { clearDb } from "../utils/clear-db";
import { runDb, setIsTestMode } from "../../../src/db/mongo.db";
import { appConfig } from "../../../src/core/settings/settings";
import { createUser } from "../utils/users/create-user";
import request from "supertest";
import { AUTH_PATH, SECURITY_PATH } from "../../../src/core/paths/paths";
import { HttpStatus } from "../../../src/core/types/http-statuses";
import { UserInput } from "../../../src/users/dto/user.input-dto";
import { getUserDto } from "../utils/users/get-user-dto";

describe("Security API", () => {
  const app = express();
  setupApp(app);

  let cookie1: string, cookie2: string, cookie3: string, cookie4: string;
  let deviceList: Array<{
    deviceId: string;
    ip: string;
    title: string;
    lastActiveDate: string;
  }>;
  let device1Id: string,
    device2Id: string,
    device3Id: string,
    device4Id: string;

  beforeAll(async () => {
    setIsTestMode(true);
    await runDb(appConfig.MONGO_URI);
    await clearDb(app);
  });

  it("login four users with different user-agent", async () => {
    const newUser: UserInput = {
      ...getUserDto(),
      login: "admin",
      password: "123456",
      email: "admin@example.com",
    };
    await createUser(app, newUser);

    const loginResponse1 = await request(app)
      .post(`${AUTH_PATH}/login`)
      .set("User-Agent", "supertest-agent1")
      .send({ loginOrEmail: newUser.email, password: newUser.password })
      .expect(HttpStatus.Ok);

    const loginResponse2 = await request(app)
      .post(`${AUTH_PATH}/login`)
      .set("User-Agent", "supertest-agent2")
      .send({ loginOrEmail: newUser.email, password: newUser.password })
      .expect(HttpStatus.Ok);

    const loginResponse3 = await request(app)
      .post(`${AUTH_PATH}/login`)
      .set("User-Agent", "supertest-agent3")
      .send({ loginOrEmail: newUser.email, password: newUser.password })
      .expect(HttpStatus.Ok);

    const loginResponse4 = await request(app)
      .post(`${AUTH_PATH}/login`)
      .set("User-Agent", "supertest-agent4")
      .send({ loginOrEmail: newUser.email, password: newUser.password })
      .expect(HttpStatus.Ok);

    // extract refresh-token cookies
    cookie1 = loginResponse1.headers["set-cookie"][0];
    cookie2 = loginResponse2.headers["set-cookie"][0];
    cookie3 = loginResponse3.headers["set-cookie"][0];
    cookie4 = loginResponse4.headers["set-cookie"][0];

    // get initial list of devices
    const { body } = await request(app)
      .get(`${SECURITY_PATH}/devices`)
      .set("Cookie", cookie1)
      .expect(HttpStatus.Ok);

    deviceList = body;
    expect(deviceList).toHaveLength(4);

    [device1Id, device2Id, device3Id, device4Id] = deviceList.map(
      (d) => d.deviceId,
    );
  });

  it("delete device2 using device1's token", async () => {
    await request(app)
      .delete(`${SECURITY_PATH}/devices/${device2Id}`)
      .set("Cookie", cookie1)
      .expect(HttpStatus.NoContent);

    const { body } = await request(app)
      .get(`${SECURITY_PATH}/devices`)
      .set("Cookie", cookie1)
      .expect(HttpStatus.Ok);

    expect(body.find((d: any) => d.deviceId === device2Id)).toBeUndefined();
  });

  it("logout device3 and ensure it disappears from the list", async () => {
    await request(app)
      .post(`${AUTH_PATH}/logout`)
      .set("Cookie", cookie3)
      .expect(HttpStatus.NoContent);

    const { body } = await request(app)
      .get(`${SECURITY_PATH}/devices`)
      .set("Cookie", cookie1)
      .expect(HttpStatus.Ok);

    expect(body.find((d: any) => d.deviceId === device3Id)).toBeUndefined();
  });

  it("delete all other devices, leaving only current (device1)", async () => {
    await request(app)
      .delete(`${SECURITY_PATH}/devices`)
      .set("Cookie", cookie1)
      .expect(HttpStatus.NoContent);

    const { body } = await request(app)
      .get(`${SECURITY_PATH}/devices`)
      .set("Cookie", cookie1)
      .expect(HttpStatus.Ok);

    expect(body).toHaveLength(1);
    expect(body[0].deviceId).toEqual(device1Id);
  });
});
