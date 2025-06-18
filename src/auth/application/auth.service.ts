import { Result } from "../../core/result/result.type";
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
import { SessionModel } from "../domain/session.entity";
import { UserModel } from "../../users/domain/user.entity";

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

    const userId = result.data!._id.toString();
    const existSession = await this.authRepositories.findSession({
      userId,
      deviceName: userAgent,
    });

    let refreshToken;
    let cookie;

    try {
      const refreshData = await this.jwtService.createRefreshToken(
        userId,
        ip,
        userAgent,
        existSession?.deviceId,
      );

      if (!refreshData.cookie) {
        throw new Error("Cookie generation failed");
      }

      cookie = refreshData.cookie;
      refreshToken = refreshData.token;

      const verifiedToken = (await this.jwtService.verifyRefreshToken(
        refreshToken,
      )) as RefreshToken;
      if (!verifiedToken) {
        return {
          status: ResultStatus.Unauthorized,
          errorMessage: "Invalid token",
          extensions: [
            { field: "token", message: "Token verification failed" },
          ],
          data: null,
        };
      }

      if (existSession) {
        if (existSession.deletedAt !== null) {
          return {
            status: ResultStatus.Unauthorized,
            extensions: [
              { field: "token", message: "Token verification failed" },
            ],
            data: null,
          };
        }
        existSession.updateSession(verifiedToken.iat, verifiedToken.exp);
        await this.authRepositories.save(existSession);
      } else {
        const newSession = SessionModel.createSession(
          userId,
          verifiedToken.iat,
          verifiedToken.exp,
          verifiedToken.deviceId,
          ip,
          userAgent,
        );

        await this.authRepositories.save(newSession);
      }

      const accessToken = await this.jwtService.createToken(userId);

      return {
        status: ResultStatus.Success,
        data: {
          accessToken,
          cookie,
        },
        extensions: [],
      };
    } catch (error) {
      return {
        status: ResultStatus.Unauthorized,
        errorMessage: "Authentication failed",
        extensions: [{ field: "general", message: "Internal server error" }],
        data: null,
      };
    }
  }

  async checkUserCredentials(loginOrEmail: string, password: string) {
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

    const newUser = UserModel.createUser(
      { login, email, password },
      passwordHash,
    );

    await this.userRepository.save(newUser);

    this.nodemailerService
      .sendEmail(
        newUser.email,
        newUser.emailConfirmation.confirmationCode,
        emailExamples.registrationEmail,
      )
      .catch((er) => console.error("error in send email:", er));

    return {
      status: ResultStatus.Success,
      data: newUser.id,
      extensions: [],
    };
  }

  async registrationConfirmationUser(code: string) {
    const user = await this.userRepository.findByCode(code);
    if (!user) {
      return {
        status: ResultStatus.BadRequest,
        errorMessage: "Bad Request",
        data: null,
        extensions: [{ field: "code", message: "there is no such code" }],
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
          { field: "expirationDate", message: "confirmation time expired" },
        ],
      };
    }
    user.registrationConfirmationUser();
    this.userRepository.save(user);

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
    user.updateCodeAndExpirationDate(newConfirmationCode, newExpirationDate);

    await this.userRepository.save(user);

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
    const { userId, deviceName, deviceId } = refreshTokenPayload;

    const sessionExists = await this.authRepositories.findSession({
      deviceId: deviceId,
    });

    if (!sessionExists) {
      return {
        status: ResultStatus.Unauthorized,
        errorMessage: "There is no such session",
        data: null,
        extensions: [],
      };
    }
    if (sessionExists.deletedAt !== null) {
      return {
        status: ResultStatus.Unauthorized,
        errorMessage: "Session was invalidated",
        extensions: [
          { field: "session", message: "Session is no longer valid" },
        ],
        data: null,
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

    sessionExists.updateSession(token.iat, token.exp);

    await this.authRepositories.save(sessionExists);

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
    sessionExists.deleteSession();
    await this.authRepositories.save(sessionExists);

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

    user.updateCodeAndExpirationDate(newConfirmationCode, newExpirationDate);

    await this.userRepository.save(user);

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
        errorMessage: "User not found",
        data: null,
        extensions: [],
      };
    }
    const newPasswordHash = await this.argon2Service.generateHash(newPassword);
    user.updatePassword(newPasswordHash);
    await this.userRepository.save(user);
    return {
      status: ResultStatus.Success,
      data: null,
      extensions: [],
    };
  }
}
