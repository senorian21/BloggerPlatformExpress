import { userRepository } from "../../users/repositories/users.repository";
import { User } from "../../users/types/user";
import { Result } from "../../core/result/result.type";
import { WithId } from "mongodb";
import { ResultStatus } from "../../core/result/resultCode";
import { argon2Service } from "../adapters/argon2.service";
import { jwtService } from "../adapters/jwt.service";

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
        extensions: [{field: "loginOrEmail", message: "Not Found"}],
      };
    }

    const isPassCorrect = await argon2Service.checkPassword(password, user.password);
    if (!isPassCorrect) {
      return {
        status: ResultStatus.Unauthorized,
        data: null,
        errorMessage: "Bad request",
        extensions: [{field: "password", message: "Wrong password"}],
      };
    }

    return {
      status: ResultStatus.Success,
      data: user,
      extensions: [],
    };
  }
};
