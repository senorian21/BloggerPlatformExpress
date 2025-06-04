import { jwtService } from "../../auth/adapters/jwt.service";
import { ResultStatus } from "../../core/result/resultCode";
import { RefreshToken } from "../../auth/types/tokens";
import { authRepositories } from "../../auth/repositories/auth.Repository";
import { session } from "../../auth/types/session";

export const securityService = {
  async deleteSessionsByDeviceId(refreshToken: string, deleteDeviceId: string) {
    const payload = (await jwtService.verifyRefreshToken(
      refreshToken,
    )) as RefreshToken;

    if (!payload) {
      return {
        status: ResultStatus.Unauthorized,
        errorMessage: "Invalid refresh token",
        data: null,
        extensions: [],
      };
    }

    const { userId } = payload;

    const foundSession =
      await authRepositories.findSession({deviceId: deleteDeviceId});

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

    await authRepositories.deleteSessionByDeviceId(userId, deleteDeviceId);

    return {
      status: ResultStatus.Success,
      errorMessage: "",
      data: null,
      extensions: [],
    };
  },

  async deleteAllDeviceExceptTheActiveOne(refreshToken: string) {
    const payload = (await jwtService.verifyRefreshToken(
      refreshToken,
    )) as RefreshToken;
    if (!payload) {
      return {
        status: ResultStatus.Unauthorized,
        errorMessage: "Session not found",
        data: null,
        extensions: [],
      };
    }
    const { userId, deviceId } = payload;

    await authRepositories.deleteDevice(deviceId, userId);

    return {
      status: ResultStatus.Success,
      errorMessage: "",
      data: null,
      extensions: [],
    };
  },
};
