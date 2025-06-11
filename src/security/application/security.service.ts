import { ResultStatus } from "../../core/result/resultCode";
import { RefreshToken } from "../../auth/types/tokens";
import { JwtService } from "../../auth/adapters/jwt.service";
import { AuthRepositories } from "../../auth/repositories/auth.Repository";
import { injectable } from "inversify";

@injectable()
export class SecurityService {
  constructor(
    public jwtService: JwtService,
    public authRepositories: AuthRepositories,
  ) {}

  async deleteSessionsByDeviceId(refreshToken: string, deleteDeviceId: string) {
    const payload = (await this.jwtService.verifyRefreshToken(refreshToken)) as RefreshToken;
    if (!payload) {
      return {
        status: ResultStatus.Unauthorized,
        errorMessage: "Invalid refresh token",
        data: null,
        extensions: [],
      };
    }

    const { userId } = payload;

    const foundSession = await this.authRepositories.findSession({ deviceId: deleteDeviceId });

    if (!foundSession) {
      return {
        status: ResultStatus.NotFound,
        errorMessage: "Session not found",
        data: null,
        extensions: [],
      };
    }

    if (foundSession.userId !== userId) {
      return {
        status: ResultStatus.Forbidden,
        errorMessage: "Session not found",
        data: null,
        extensions: [],
      };
    }

    if (foundSession.deletedAt !== null) {
      return {
        status: ResultStatus.Success,
        errorMessage: "",
        data: null,
        extensions: [],
      };
    }

    foundSession.deletedAt = new Date();
    await this.authRepositories.save(foundSession);

    return {
      status: ResultStatus.Success,
      errorMessage: "",
      data: null,
      extensions: [],
    };
  }

  async deleteAllDeviceExceptTheActiveOne(refreshToken: string) {
    const payload = (await this.jwtService.verifyRefreshToken(
        refreshToken
    )) as RefreshToken;

    if (!payload) {
      return {
        status: ResultStatus.Unauthorized,
        errorMessage: "Invalid refresh token",
        data: null,
        extensions: [],
      };
    }

    const { userId, deviceId } = payload;

    const activeSession = await this.authRepositories.findSession({ deviceId });
    if (!activeSession || activeSession.userId !== userId) {
      return {
        status: ResultStatus.Forbidden,
        errorMessage: "Session not found",
        data: null,
        extensions: [],
      };
    }

    await this.authRepositories.deleteDevice(deviceId, userId);

    return {
      status: ResultStatus.Success,
      errorMessage: "",
      data: null,
      extensions: [],
    };
  }
}
