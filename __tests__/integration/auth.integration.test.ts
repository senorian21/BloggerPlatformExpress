import { client, runDb, setIsTestMode } from "../../src/db/mongo.db";
import { clearDb } from "../e2e/utils/clear-db";
import express from "express";
import { setupApp } from "../../src/setup-app";
import { nodemailerService } from "../../src/auth/adapters/nodemailer.service";
import { authService } from "../../src/auth/application/auth.service";
import { MongoMemoryServer } from "mongodb-memory-server";
import { testSeeder } from "./test.seeder";
import { ResultStatus } from "../../src/core/result/resultCode";
import { describe } from "node:test";
import { createUser } from "../e2e/utils/users/create-user";

describe("AUTH-INTEGRATION", () => {
  const app = express();
  setupApp(app);

  let mongoServer: MongoMemoryServer;
  let registerUserUseCase: any;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await runDb(mongoServer.getUri());

    registerUserUseCase = authService.registerUser;
  });

  beforeEach(() => {
    nodemailerService.sendEmail = jest
      .fn()
      .mockImplementation(
        (email: string, code: string, template: (code: string) => string) =>
          Promise.resolve(true),
      );
  });

  afterAll(async () => {
    // await client.close();
    // await new Promise(resolve => setTimeout(resolve, 500)); // <-- Добавлено
    await mongoServer.stop();
  });

  describe("User Registration", () => {
    it("should register user with correct data", async () => {
      const { login, pass, email } = testSeeder.createUserDto();
      const result = await registerUserUseCase(login, pass, email);

      expect(result.status).toBe(ResultStatus.Success);
      expect(nodemailerService.sendEmail).toBeCalled();
      expect(nodemailerService.sendEmail).toBeCalledTimes(1);
    });
    it("should not register user twice", async () => {
      const { login, pass, email } = testSeeder.createUserDto();
      await testSeeder.insertUser({ login, pass, email });

      const result = await registerUserUseCase(login, pass, email);

      expect(result.status).toBe(ResultStatus.BadRequest);
    });
  });
  describe("Confirm email", () => {
    const confirmEmailUseCase = authService.registrationConfirmationUser;
    it("should not confirm email if user does not exist", async () => {
      const result = await confirmEmailUseCase("bnfgndflkgmk");

      expect(result.status).toBe(ResultStatus.BadRequest);
    });
    it("should not confirm email which is confirmed", async () => {
      const code = "test";

      const { login, pass, email } = testSeeder.createUserDto();
      await testSeeder.insertUser({
        login,
        pass,
        email,
        code,
        isConfirmed: true,
      });

      const result = await confirmEmailUseCase(code);

      expect(result.status).toBe(ResultStatus.BadRequest);
    });
    it("should not confirm email with expired code", async () => {
      const code = "test";

      const { login, pass, email } = testSeeder.createUserDto();
      await testSeeder.insertUser({
        login,
        pass,
        email,
        code,
        expirationDate: new Date(),
      });

      const result = await confirmEmailUseCase(code);

      expect(result.status).toBe(ResultStatus.BadRequest);
    });
    it("confirm user", async () => {
      const code = "123e4567-e89b-12d3-a456-426614174000";

      const { login, pass, email } = testSeeder.createUserDto();
      await testSeeder.insertUser({ login, pass, email, code });

      const result = await confirmEmailUseCase(code);

      expect(result.status).toBe(ResultStatus.Success);
    });
  });
  describe("registration email resending", () => {
    const confirmEmailUseCase = authService.registrationEmailResending;
    it("confirm email resending", async () => {
      const { login, pass, email } = testSeeder.createUserDto();
      await testSeeder.insertUser({ login, pass, email });

      const result = await confirmEmailUseCase(email);

      expect(result.status).toBe(ResultStatus.Success);
    });

    it("there is no such mail", async () => {
      const email = "ilyyyyyyaaa@gmail.com";

      const result = await confirmEmailUseCase(email);
      expect(result.status).toBe(ResultStatus.BadRequest);
    });

    it("mail already confirmed", async () => {
      const user = await createUser(app);

      const result = await confirmEmailUseCase(user.email);

      expect(result.status).toBe(ResultStatus.BadRequest);
    });
  });
});
