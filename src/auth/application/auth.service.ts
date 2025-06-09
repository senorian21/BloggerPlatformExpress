import { User } from "../../users/types/user";
import { Result } from "../../core/result/result.type";
import { WithId } from "mongodb";
import { ResultStatus } from "../../core/result/resultCode";
import { emailExamples } from "../adapters/emailExamples";
import { randomUUID } from "crypto";
import { add } from "date-fns";
import { RefreshToken } from "../types/tokens";
import { AuthRepositories } from "../repositories/auth.Repository";
import { JwtService } from "../adapters/jwt.service";
import { UserRepository } from "../../users/repositories/users.repository";
import { Argon2Service } from "../adapters/argon2.service";
import { NodemailerService } from "../adapters/nodemailer.service";
import { injectable } from "inversify";
import { session } from "../domain/auth.entity";

@injectable()
export class AuthService {
  constructor(
    public authRepositories: AuthRepositories,
    public jwtService: JwtService,
    public userRepository: UserRepository,
    public argon2Service: Argon2Service,
    public nodemailerService: NodemailerService,
  ) {}
  async loginUser(
    loginOrEmail: string,
    password: string,
    ip: string,
    userAgent: string,
  ): Promise<Result<{ accessToken: string; cookie: string } | null>> {
    const result = await this.checkUserCredentials(loginOrEmail, password);
    if (result.status !== ResultStatus.Success) {
      return {
        status: ResultStatus.Unauthorized,
        errorMessage: "Unauthorized",
        extensions: [{ field: "loginOrEmail", message: "Wrong credentials" }],
        data: null,
      };
    }
    const userIdToken = result.data?._id;

    if (!userIdToken) {
      return {
        status: ResultStatus.Unauthorized,
        errorMessage: "User ID not found",
        extensions: [{ field: "userId", message: "Invalid user ID" }],
        data: null,
      };
    }
    const existSessions = await this.authRepositories.findSession({
      userId: userIdToken.toString(),
      deviceName: userAgent,
    });
    let actualDeviceId;

    let refreshToken;
    let cookie;

    if (existSessions) {
      actualDeviceId = existSessions?.deviceId;

      const refreshData = await this.jwtService.createRefreshToken(
        result.data!._id.toString(),
        ip,
        userAgent,
        actualDeviceId,
      );

      refreshToken = refreshData.token;
      cookie = refreshData.cookie;
    } else {
      const refreshData = await this.jwtService.createRefreshToken(
        result.data!._id.toString(),
        ip,
        userAgent,
      );

      refreshToken = refreshData.token;
      cookie = refreshData.cookie;
    }

    const accessToken = await this.jwtService.createToken(
      result.data!._id.toString(),
    );

    const verifiedToken =
      await this.jwtService.verifyRefreshToken(refreshToken);
    if (!verifiedToken) {
      return {
        status: ResultStatus.Unauthorized,
        errorMessage: "Invalid token",
        extensions: [{ field: "token", message: "Token verification failed" }],
        data: null,
      };
    }

    const refreshTokenPayload = verifiedToken as RefreshToken;
    const { userId, iat, exp, deviceName, deviceId } = refreshTokenPayload;

    const newSession: session = {
      userId,
      createdAt: iat!.toString(),
      expiresAt: exp!.toString(),
      deviceId,
      deviceName,
      ip,
    };

    await this.authRepositories.updateOrCreateSession(newSession);

    return {
      status: ResultStatus.Success,
      data: {
        accessToken,
        cookie,
      },
      extensions: [],
    };
  }

  async checkUserCredentials(
    loginOrEmail: string,
    password: string,
  ): Promise<Result<WithId<User> | null>> {
    const user = await this.userRepository.findByLoginOrEmail(loginOrEmail);

    if (!user) {
      return {
        status: ResultStatus.NotFound,
        data: null,
        errorMessage: "Not Found",
        extensions: [{ field: "loginOrEmail", message: "Not Found" }],
      };
    }

    const isPassCorrect = await this.argon2Service.checkPassword(
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
  }

  async registerUser(
    login: string,
    password: string,
    email: string,
  ): Promise<Result<string | null>> {
    const user = await this.userRepository.doesExistByLoginOrEmail(
      login,
      email,
    );
    if (user) {
      if (user.login === login) {
        return {
          status: ResultStatus.BadRequest,
          errorMessage: "Bad Request",
          data: null,
          extensions: [{ field: "login", message: "Login is already taken" }],
        };
      } else {
        return {
          status: ResultStatus.BadRequest,
          errorMessage: "Bad Request",
          data: null,
          extensions: [
            { field: "email", message: "Email is already registered" },
          ],
        };
      }
    }

    const passwordHash = await this.argon2Service.generateHash(password);
    const newUser = new User(login, email, passwordHash);
    const createdUser = await this.userRepository.createUser(newUser);

    this.nodemailerService
      .sendEmail(
        newUser.email,
        newUser.emailConfirmation.confirmationCode,
        emailExamples.registrationEmail,
      )
      .catch((er) => console.error("error in send email:", er));

    return {
      status: ResultStatus.Success,
      data: createdUser,
      extensions: [],
    };
  }

  async registrationConfirmationUser(
    code: string,
  ): Promise<Result<WithId<User> | null>> {
    const user = await this.userRepository.findByCode(code);
    if (!user) {
      return {
        status: ResultStatus.BadRequest,
        errorMessage: "Bad Request",
        data: null,
        extensions: [{ field: "code", message: "there is no such code" }],
      };
    }

    const userId = user!._id.toString();

    if (user.emailConfirmation.isConfirmed) {
      return {
        status: ResultStatus.BadRequest,
        errorMessage: "Bad Request",
        data: null,
        extensions: [{ field: "isConfirmed", message: "Already confirmed" }],
      };
    }
    if (new Date(user.emailConfirmation.expirationDate) < new Date()) {
      return {
        status: ResultStatus.BadRequest,
        errorMessage: "Bad Request",
        data: null,
        extensions: [
          { field: "expirationDate", message: "confirmation time expired" },
        ],
      };
    }
    const confirmUser = await this.userRepository.registrationConfirmationUser(
      user,
      userId,
    );
    if (confirmUser.status !== ResultStatus.Success) {
      return {
        status: ResultStatus.BadRequest,
        errorMessage: "Bad Request",
        data: null,
        extensions: [{ field: "", message: "" }],
      };
    }

    return {
      status: ResultStatus.Success,
      data: null,
      extensions: [],
    };
  }

  async registrationEmailResending(
    email: string,
  ): Promise<Result<string | null>> {
    const user = await this.userRepository.findByLoginOrEmail(email);
    if (!user) {
      return {
        status: ResultStatus.BadRequest,
        errorMessage: "Bad Request",
        data: null,
        extensions: [{ field: "email", message: "User not found" }],
      };
    }

    if (user.emailConfirmation.isConfirmed) {
      return {
        status: ResultStatus.BadRequest,
        errorMessage: "Bad Request",
        data: null,
        extensions: [{ field: "isConfirmed", message: "Already confirmed" }],
      };
    }

    if (new Date(user.emailConfirmation.expirationDate) < new Date()) {
      return {
        status: ResultStatus.BadRequest,
        errorMessage: "Bad Request",
        data: null,
        extensions: [
          {
            field: "emailConfirmation.expirationDate",
            message: "Confirmation time expired",
          },
        ],
      };
    }

    const newConfirmationCode = randomUUID();
    const newExpirationDate = add(new Date(), { days: 7 });

    await this.userRepository.updateConfirmationCodeAndExpiration(
      user._id.toString(),
      newConfirmationCode,
      newExpirationDate,
    );

    this.nodemailerService
      .sendEmail(
        user.email,
        newConfirmationCode,
        emailExamples.registrationEmail,
      )
      .catch((er) => console.error("Error in send email:", er));

    return {
      status: ResultStatus.Success,
      data: null,
      extensions: [],
    };
  }

  async refreshToken(refreshToken: string, ip: string, userAgent: string) {
    const payload = await this.jwtService.verifyRefreshToken(refreshToken);
    if (!payload) {
      return {
        status: ResultStatus.Unauthorized,
        errorMessage: "Invalid token signature or expired",
        data: null,
        extensions: [],
      };
    }

    const refreshTokenPayload = payload as RefreshToken;
    const { userId, iat, exp, deviceName, deviceId } = refreshTokenPayload;
    const session: session = {
      userId,
      createdAt: iat!.toString(),
      expiresAt: exp!.toString(),
      deviceId,
      deviceName,
      ip,
    };

    const sessionExists = await this.authRepositories.findSession(session);

    if (!sessionExists) {
      return {
        status: ResultStatus.Unauthorized,
        errorMessage: "There is no such session",
        data: null,
        extensions: [],
      };
    }

    const { token: newRefreshToken, cookie } =
      await this.jwtService.createRefreshToken(
        userId,
        ip,
        deviceName,
        deviceId,
      );
    const token = (await this.jwtService.verifyRefreshToken(
      newRefreshToken,
    )) as RefreshToken;

    const newIssuedAt = token.iat!.toString();
    const newExpiresAt = token.exp!.toString();
    await this.authRepositories.updateSession(
      sessionExists,
      newIssuedAt!,
      newExpiresAt!,
    );

    const newAccessToken = await this.jwtService.createToken(userId);

    return {
      status: ResultStatus.Success,
      data: { newAccessToken, newRefreshToken },
      extensions: [],
    };
  }

  async logout(refreshToken: string) {
    const payload = (await this.jwtService.verifyRefreshToken(
      refreshToken,
    )) as RefreshToken;

    if (!payload) {
      return {
        status: ResultStatus.Unauthorized,
        errorMessage: "Invalid token signature or expired",
        data: null,
        extensions: [],
      };
    }

    const { userId, deviceId } = payload;

    const sessionExists = await this.authRepositories.findSession({
      userId,
      deviceId,
    });
    if (!sessionExists || !sessionExists._id) {
      return {
        status: ResultStatus.Unauthorized,
        errorMessage: "Invalid token signature or expired",
        data: null,
        extensions: [],
      };
    }

    await this.authRepositories.deleteSession(sessionExists._id);

    return {
      status: ResultStatus.Success,
      data: null,
      extensions: [],
    };
  }

  async passwordRecovery(email: string) {
    const user = await this.userRepository.findByLoginOrEmail(email);
    if (!user) {
      return {
        status: ResultStatus.Unauthorized,
        errorMessage: "There is no such user",
        data: null,
        extensions: [],
      };
    }

    const newConfirmationCode = randomUUID();
    const newExpirationDate = add(new Date(), { days: 7 });

    await this.userRepository.updateConfirmationCodeAndExpiration(
      user._id.toString(),
      newConfirmationCode,
      newExpirationDate,
    );

    this.nodemailerService
      .sendEmail(
        user.email,
        newConfirmationCode,
        emailExamples.passwordRecovery,
      )
      .catch((er) => console.error("Error in send email:", er));

    return {
      status: ResultStatus.Success,
      data: null,
      extensions: [],
    };
  }
  async newPassword(newPassword: string, recoveryCode: string) {
    const user = await this.userRepository.findByCode(recoveryCode);
    if (!user) {
      return {
        status: ResultStatus.BadRequest,
        errorMessage: "There is no such user",
        data: null,
        extensions: [],
      };
    }
    const newPasswordHash = await this.argon2Service.generateHash(newPassword);
    await this.userRepository.updatePasswordUser(
      user._id.toString(),
      newPasswordHash,
    );

    return {
      status: ResultStatus.Success,
      data: null,
      extensions: [],
    };
  }
}
