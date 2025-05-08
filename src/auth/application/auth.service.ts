import { userRepository } from "../../users/repositories/users.repository";
import { User } from "../../users/types/user";
import { Result } from "../../core/result/result.type";
import { WithId } from "mongodb";
import { ResultStatus } from "../../core/result/resultCode";
import { argon2Service } from "../adapters/argon2.service";
import { jwtService } from "../adapters/jwt.service";
import { accessTokenGuard } from "../../comments/application/comments.service";
import {nodemailerService} from "../adapters/nodemailer.service";
import {emailExamples} from "../adapters/emailExamples";

export const authService = {
  async loginUser(
    loginOrEmail: string,
    password: string,
  ): Promise<Result<{ accessToken: string } | null>> {
    const result = await this.checkUserCredentials(loginOrEmail, password);
    if (result.status !== ResultStatus.Success) {
      return {
        status: ResultStatus.Unauthorized,
        errorMessage: "Unauthorized",
        extensions: [{ field: "loginOrEmail", message: "Wrong credentials" }],
        data: null,
      };
    }
    const accessToken = await jwtService.createToken(
      result.data!._id.toString(),
    );

    return {
      status: ResultStatus.Success,
      data: { accessToken },
      extensions: [],
    };
  },

  async checkUserCredentials(
    loginOrEmail: string,
    password: string,
  ): Promise<Result<WithId<User> | null>> {
    const user = await userRepository.findByLoginOrEmail(loginOrEmail);

    if (!user) {
      return {
        status: ResultStatus.NotFound,
        data: null,
        errorMessage: "Not Found",
        extensions: [{ field: "loginOrEmail", message: "Not Found" }],
      };
    }

    const isPassCorrect = await argon2Service.checkPassword(
      password,
      user.passwordHash,
    );
    if (!isPassCorrect) {
      return {
        status: ResultStatus.Unauthorized,
        data: null,
        errorMessage: "Bad request",
        extensions: [{ field: "password", message: "Wrong password" }],
      };
    }

    return {
      status: ResultStatus.Success,
      data: user,
      extensions: [],
    };
  },

  async userId(header: string) {
    const userId = await accessTokenGuard(header);
    if (userId.status !== ResultStatus.Success) {
      return {
        status: ResultStatus.Unauthorized,
        data: null,
        errorMessage: "Unauthorized",
        extensions: [],
      };
    }

    return {
      status: ResultStatus.Success,
      data: userId.data?.userId,
      extensions: [],
    };
  },

  async registerUser(
    login: string,
    password: string,
    email: string,
  ): Promise<Result<string | null>> {
    const user = await userRepository.doesExistByLoginOrEmail(login, email);
    if (user)
      return {
        status: ResultStatus.BadRequest,
        errorMessage: "Bad Request",
        data: null,
        extensions: [{ field: "login Or Email", message: "Already Registered" }],
      };

    const passwordHash = await argon2Service.generateHash(password);
    const newUser = new User(login, email, passwordHash);
    const createdUser = await userRepository.createUser(newUser);

    nodemailerService.sendEmail(
        newUser.email,
        newUser.emailConfirmation.confirmationCode,
        emailExamples.registrationEmail
    ).catch(er => console.error('error in send email:', er))


    return {
      status: ResultStatus.Success,
      data: createdUser,
      extensions: [],
    };
  },
};
